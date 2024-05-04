import { Model } from 'mongoose';

import PurchaseEnUS from '../models/purchases/purchaseEnUS.model';
import PurchaseFR from '../models/purchases/purchaseFr.model';
import APIFeatures from '../utils/apiFeatures';
import { CreateEntity, FindAllEntities } from './common.service';

import {
  PurchaseDocument,
  PurchaseInput,
} from '../models/purchases/schemaDefs';

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
  const ProductModel = getPurchaseModel(language);

  const features = await APIFeatures({
    model: ProductModel,
    reqQuery,
    findOptions,
  });

  features.filter().sort().project().paginate();

  const purchases = await features.result();

  return purchases.map(product => product.toJSON()) as PurchaseDocument[];
};

// CRUD - Create //////////

type CreatePurchase = CreateEntity<PurchaseInput, PurchaseDocument>;

export const createPurchase: CreatePurchase = async ({ language, input }) => {
  const ProductModel = getPurchaseModel(language);

  const product = await ProductModel.create(input);

  return product.toJSON() as PurchaseDocument;
};
