import { Request } from 'express';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import config from 'config';

import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import logger from '../utils/logger';
import PurchaseEnUS from '../models/purchases/purchaseEnUS.model';
import PurchaseFR from '../models/purchases/purchaseFr.model';
import { findProductByID } from './product.service';

import {
  CreateEntity,
  FindAllEntities,
  FindAndDeleteEntity,
  FindAndUpdateEntity,
  FindEntityByID,
} from './common.service';

import {
  PurchaseDocument,
  PurchaseInput,
} from '../models/purchases/schemaDefs';
import { findUser } from './user.service';

// Helper functions //////////

export const getPurchaseModel = (language: string): Model<PurchaseDocument> => {
  let PurchaseModel: Model<PurchaseDocument> = PurchaseEnUS; // 'en-us'
  if (language === 'fr') PurchaseModel = PurchaseFR;

  return PurchaseModel;
};

// Checkouts //////////

type CheckoutSessionProduct = { productID: string; quantity: number };
type CheckoutSessionOptions = {
  language: string;
  products: CheckoutSessionProduct[];
};

const checkoutSessionPrice = async ({
  language,
  products,
}: CheckoutSessionOptions): Promise<number> => {
  const totalPrice = await products.reduce(
    async (accPromise: Promise<number>, cur: CheckoutSessionProduct) => {
      const acc = await accPromise;

      const product = await findProductByID({
        language,
        entityID: cur.productID,
        options: { fields: 'price' },
      });

      const price =
        (product.price.default - product.price.saleAmount!) * cur.quantity;

      return acc + price;
    },
    Promise.resolve(0)
  );

  return Number(totalPrice.toFixed(2));
};

type CheckoutProduct = { productID: string; quantity: number };

type CreateCheckoutSessionOptions = {
  language: string;
  customerEmail: string;
  products: CheckoutProduct[];
};

export const createCheckoutSession = async ({
  language,
  customerEmail,
  products,
}: CreateCheckoutSessionOptions) => {
  const clientOriginUrl = config.get<string>('clientOriginUrl');
  const stripeSecretKey = config.get<string>('stripeSecretKey');

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' });

  const totalPrice = await checkoutSessionPrice({ language, products });

  const clientReferenceID = JSON.stringify({ language, products });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${clientOriginUrl}?payment=success`,
    cancel_url: `${clientOriginUrl}?payment=error`,
    customer_email: customerEmail,
    client_reference_id: clientReferenceID,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: totalPrice * 100,
          product_data: {
            name: 'Yasuo API - Yasuo Shop Items',
            description:
              "Notice: Item availability isn't guaranteed until checkout is complete.",
            images: [
              'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b',
            ],
          },
        },
      },
    ],
  });

  return session;
};

export const handleWebhookCheckoutEvent = (req: Request) => {
  try {
    const stripeSecretKey = config.get<string>('stripeSecretKey');
    const stripeWebhookSecret = config.get<string>('stripeWebhookSecret');

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' });

    const signature = req.headers['stripe-signature'] as string;

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret
    );

    if (event.type === 'checkout.session.completed')
      return { session: event.data.object, error: null };

    throw new Error('Something went wrong!');
  } catch (error: any) {
    logger.error(error, 'Webhook Checkout Event Failed!');

    return { session: null, error };
  }
};

type ClientReferenceID = { language: string; products: CheckoutProduct[] };

export const createWebhookCheckoutPurchases = async (
  session: Stripe.Checkout.Session
) => {
  const user = await findUser({
    query: { email: session.customer_email as string },
  });

  const { language, products }: ClientReferenceID = JSON.parse(
    session.client_reference_id as string
  );

  const PurchaseModel = getPurchaseModel(language);

  const newProducts = await Promise.all(
    products.map(async ({ productID, quantity }) => {
      const product = await findProductByID({ language, entityID: productID });

      const price = product.price.default - product.price.saleAmount!;

      return {
        user: user._id.toString(),
        product: product._id.toString(),
        price: Number(price.toFixed(2)),
        quantity,
        paid: true,
      };
    })
  );

  await PurchaseModel.create(newProducts);
};

// CRUD - Read //////////

export const findAllPurchases: FindAllEntities<PurchaseDocument> = async ({
  language,
  reqQuery = {},
  findOptions = {},
}) => {
  const PurchaseModel = getPurchaseModel(language);

  const options = { model: PurchaseModel, reqQuery, findOptions };
  const features = await APIFeatures(options);

  features.filter().sort().project().paginate();

  const purchases = await features.result();

  return purchases.map(product => product.toJSON()) as PurchaseDocument[];
};

export const findPurchaseByID: FindEntityByID<PurchaseDocument> = async ({
  language,
  entityID,
  options = {},
}) => {
  const PurchaseModel = getPurchaseModel(language);

  // { name: true, price.default: true,... } -> projecting
  let selectOptions: { [key: string]: true } = {};
  let { fields } = options;

  if (fields) {
    if (!Array.isArray(fields)) fields = fields.split(',');
    fields.forEach(field => (selectOptions[field] = true));
  }

  const purchase = await PurchaseModel.findById(entityID, selectOptions);

  if (!purchase)
    throw new AppError({ message: 'Purchase not found!', statusCode: 404 });

  return purchase.toJSON() as PurchaseDocument;
};

// CRUD - Create //////////

type CreatePurchase = CreateEntity<PurchaseInput, PurchaseDocument>;

export const createPurchase: CreatePurchase = async ({ language, input }) => {
  const PurchaseModel = getPurchaseModel(language);

  const product = await PurchaseModel.create(input);

  return product.toJSON() as PurchaseDocument;
};

// CRUD - Update //////////

export const findAndUpdatePurchase: FindAndUpdateEntity<
  PurchaseDocument
> = async ({ language, entityID, update, options }) => {
  const PurchaseModel = getPurchaseModel(language);

  const purchase = await PurchaseModel.findByIdAndUpdate(
    entityID,
    update,
    options
  );

  if (!purchase) return null;
  return purchase.toJSON() as PurchaseDocument;
};

// CRUD - Delete //////////

export const findAndDeletePurchase: FindAndDeleteEntity = async ({
  language,
  entityID,
}) => {
  const PurchaseModel = getPurchaseModel(language);

  await PurchaseModel.findByIdAndDelete(entityID);
};
