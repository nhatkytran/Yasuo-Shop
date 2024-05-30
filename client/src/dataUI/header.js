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

export const menuContents = {
  [TYPE_FEATURED]: [
    {
      title: 'VALORANT collection',
      image:
        'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/bltf5507959858f5c02/664bc848e8d9397af6fa735d/VALORANT_Restock_Homepage_Hero_2560x1440.jpg?auto=webp&width=518&quality=170',
      link: '/collection/valorant',
    },
    {
      title: 'VCT Masters 2024 Collection',
      image:
        'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/bltfde3cf0972c8e250/663e818fe7f45deb2a8b1110/CPX_VCT2Shanghai_NavBar_2560x1440.jpg?auto=webp&width=518&quality=170',
      link: '/collection/vct-2024',
    },

    {
      title: 'MSI 2024 Collection',
      image:
        'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/blt6ba6ed1e6371d4ee/6622b2fabb637255561dd8a7/MSI_20244_Featured_collection_navbar_2560x1440.jpg?auto=webp&width=518&quality=170',
      link: '/collection/msi-2024',
    },
    {
      title: 'Blood Moon Collection Page',
      image:
        'https://images.contentstack.io/v3/assets/blt5bbf09732528de36/bltb398804699bfb7b6/60cbce00e1b3f7481347d585/Bloodmoon_Promo_Featured.jpg?auto=webp&width=518&quality=170',
      link: '/collection/blood-moon',
    },
  ],
  [TYPE_ART]: {
    mainLink: {
      title: { [EN_US]: 'Shop All', [FR]: 'Tout Acheter' },
      link: '/category/art',
    },
    subLink: {
      links: [
        '/category/art/posters',
        '/category/art/comics-and-books',
        '/category/art/prints',
      ],
      titles: {
        [EN_US]: ['Posters', 'Comics & Books', 'Prints'],
        [FR]: ['Posters', 'Bandes dessinées et livres', 'Tirages'],
      },
    },
  },
};

export const searchPlaceholders = { [EN_US]: 'Search', [FR]: 'Rechercher' };
