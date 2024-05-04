import { Model } from 'mongoose';

import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import PurchaseEnUS from '../models/purchases/purchaseEnUS.model';
import PurchaseFR from '../models/purchases/purchaseFr.model';

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

// Helper functions //////////

const getPurchaseModel = (language: string): Model<PurchaseDocument> => {
  let PurchaseModel: Model<PurchaseDocument> = PurchaseEnUS; // 'en-us'
  if (language === 'fr') PurchaseModel = PurchaseFR;

  return PurchaseModel;
};

// CRUD - Read //////////

export const findAllPurchases: FindAllEntities<PurchaseDocument> = async ({
  language,
  reqQuery = {},
  findOptions = {},
}) => {
  const PurchaseModel = getPurchaseModel(language);

  const features = await APIFeatures({
    model: PurchaseModel,
    reqQuery,
    findOptions,
  });

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
