import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';

export const findAllProducts = async ({ language }: { language: string }) => {
  if (language === 'en-us') return ProductEnUS.find();
  if (language === 'fr') return ProductFR.find();
};
