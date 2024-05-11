import { ProductDocument } from '../models/products/schemaDefs';

export const userPayload = {
  name: 'jest',
  email: 'jest@gmail.com',
  password: '123123Aa$$',
};

export const productPayload = {
  name: 'Blood Moon Aatrox Figure 2',
  price: { default: 29.99, saleAmount: 11 },
  editions: { en: ['special edition'] },
  images: [
    'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/blt00022796bbbd3873/60ee0fbe6554cc2ee3b455cf/Aatrox_figure_Thumbnail.png',
  ],
  type: 'figure',
  category: 'featured',
  optional: {
    title: 'Blood Moon Aatrox Merch Summoner Icon',
    image:
      'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/blt19b858380d96d280/63ebdc3d6495981254659086/BloodMoonAatrox_final_2560x2560.jpg?width=104',
  },
  quote: 'I am your reckoner, mortals.',
  descriptions: [
    'Blood Moon Aatrox approaches as the World Ender as he lands in the Series 4 line as Special Edition #05.',
  ],
  features: [
    'Aatrox in his Blood Moon skin',
    'Collectible Series 4 box',
    'Exclusive League of Legends Blood Moon Aatrox In-Game Summoner Icon',
  ],
  approximateDimensions: {
    value: [
      [5.1, 12.8],
      [4.0, 10.0],
    ],
    en: ['height', 'width'],
  },
  series: 'Blood Moon Aatrox Figure is number #05 in Series 4',
} as ProductDocument;
