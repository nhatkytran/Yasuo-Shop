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
        'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134237/1_umna9l.webp',
      link: '/collection/valorant',
    },
    {
      title: 'VCT Masters 2024 Collection',
      image:
        'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134244/2_tkymjv.webp',
      link: '/collection/vct-2024',
    },

    {
      title: 'MSI 2024 Collection',
      image:
        'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134262/3_eipbi1.webp',
      link: '/collection/msi-2024',
    },
    {
      title: 'Blood Moon Collection Page',
      image:
        'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134314/4_pposib.webp',
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
    posters: [
      {
        type: 'comic',
        image:
          'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134706/1_xkgcod.webp',
        description: 'League of Legends comic',
      },
      {
        type: 'poster',
        image:
          'https://res.cloudinary.com/dxo1gnffi/image/upload/v1717134713/2_b58dm3.webp',
        description: 'League of Legends poster',
      },
    ],
  },
};

export const searchPlaceholders = { [EN_US]: 'Search', [FR]: 'Rechercher' };
