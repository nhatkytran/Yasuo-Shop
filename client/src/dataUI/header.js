import { EN_US, FR, TYPE_ART, TYPE_FEATURED, TYPE_SALE } from '~/config';

export const navbarLinks = [
  {
    type: TYPE_FEATURED,
    title: { [EN_US]: 'Featured', [FR]: "À l'affiche" },
    hasMenuOpen: true,
    mainLink: '',
  },
  {
    type: TYPE_ART,
    title: { [EN_US]: 'Art', [FR]: 'Art' },
    hasMenuOpen: true,
    mainLink: `/category/${TYPE_ART}`,
  },
  {
    type: TYPE_SALE,
    title: { [EN_US]: 'Sale', [FR]: 'Promos' },
    hasMenuOpen: false,
    mainLink: `/category/${TYPE_SALE}`,
  },
];

// export const menuContents = {
//   [TYPE_FEATURED]: {},
// };

export const searchPlaceholders = { [EN_US]: 'Search', [FR]: 'Rechercher' };
