import { EN_US, FR } from '~/config';

export const countryContents = {
  titles: { [EN_US]: 'Language', [FR]: 'Langue' },
  countries: { [EN_US]: 'United States', [FR]: 'France' },
  subTitles: { [EN_US]: 'Select A Country', [FR]: 'Sélectionnez Un Pays' },
  subTitleSmalls: { [EN_US]: 'Languages', [FR]: 'Langues' },
  links: {
    links: ['/en-us', '/fr'],
    [EN_US]: ['United States', 'France'],
    [FR]: ['United States', 'France'],
  },
};

export const shopContents = {
  titles: { [EN_US]: 'Shop', [FR]: 'Boutique' },
  links: {
    links: ['/apparel', '/collectibles', '/art', '/accessories'],
    [EN_US]: ['Apparel', 'Collectibles', 'Art', 'Accessories'],
    [FR]: ['Vêtements', 'Objets de collection', 'Art', 'Accessoires'],
  },
};

export const suportContents = {
  titles: { [EN_US]: 'Support', [FR]: 'Support' },
  links: {
    links: [
      '/order-status',
      '/faqs',
      '/shipping-information',
      '/contact-us',
      '/return-policy',
      '/collectability-guide',
      '/verify-your-product',
      '/accessibility',
    ],
    [EN_US]: [
      'Order Status',
      'FAQs',
      'Shipping Information',
      'Contact Us',
      'Return Policy',
      'Collectability Guide',
      'Verify Your Product',
      'Accessibility',
    ],
    [FR]: [
      'État de la commande',
      'FAQs',
      'Infos de livraison',
      'Nous contacter',
      'Politique de retour',
      'Vérifier votre produit',
      'Déverrouiller contenu numérique',
      'Accessibilité',
    ],
  },
};

export const copyrightContents = {
  [EN_US]: 'Copyright Riot Games 2023',
  [FR]: 'Copyright Riot Games 2023',
};

export const linkContents = {
  links: [
    '/legal',
    '/cookie-preferences',
    '/terms-conditions',
    '/privacy-policy',
  ],
  [EN_US]: [
    'Legal',
    'Cookie preferences',
    'Terms & Conditions',
    'Privacy Policy',
  ],
  [FR]: [
    'Mentions légales',
    'Préférences de cookies',
    "Conditions d'utilisation",
    'Politique de confidentialité',
  ],
};
