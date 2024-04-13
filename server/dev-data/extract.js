'use strict';

// This API are created by on data of this website:
// So this code is create to get data from HTML faster

// Helpers

const getContentOf = selector => {
  return document
    .querySelector(selector)
    ?.textContent.replace(/\n\s+/g, ' ')
    .trim();
};

const getContentsOf = (selector, conditions = {}) => {
  let els = [...document.querySelectorAll(selector)];
  if (!els.length) return;

  const { filterCond } = conditions;

  if (filterCond) els = els.filter(filterCond);

  return els.map(el => el.textContent.replace(/\n\s+/g, ' ').trim());
};

// Selectors

const productName = getContentOf('h1.theme__StyledHeadingH4-sc-35h5ms-9');
const price = Number(
  getContentOf(
    '.theme__StyleLabelBase-sc-35h5ms-16.theme__StyledLabelLarge-sc-35h5ms-17'
  )
    ?.replace('$', '')
    ?.replace('€', '')
    ?.replace(',', '.')
);
// editions
// images

// type
// optional
const sizes = getContentsOf(
  '.style__StyledOptionBody-sc-1853n6s-2 button span'
);
// warning
// shippingDays
// quote
const descriptions = getContentsOf(
  'div[aria-labelledby="product-description"] p',
  { filterCond: paragraph => !paragraph.querySelector('strong') }
);
const features = getContentsOf('.children ul li');
// approximateDimensions
// funFact
// series

let materials = [...document.querySelectorAll('p strong')];
if (materials.length) {
  materials = materials.find(strong => strong.textContent === 'Materials:');
  if (materials) {
    materials = materials.parentElement.nextElementSibling; // ul
    materials = [...materials.querySelectorAll('li')].map(li =>
      li.textContent.replace(/\n\s+/g, ' ').trim()
    );
  }
}

// Start adding information

const product = {};

productName && (product.name = productName);
price && (product.price = { default: price });
// editions
// images

product.information = {};

// type
// optional
sizes?.length && (product.information.sizes = sizes);
// warning
// shippingDays
// quote
descriptions?.length && (product.information.descriptions = descriptions);
features?.length && (product.information.features = features);
// approximateDimensions
// funFact
// series
materials.length && (product.information.materials = materials);

// properties enum

(type => {
  product.information.type = type;
})(
  {
    figure: 'figure',
    game: 'game',
    cloth: 'cloth',
    item: 'item',
  }.cloth
);

// images

let images = [...document.querySelectorAll('.swiper-wrapper img')];
if (images.length) {
  images = images.map(image => image.getAttribute('src').split('?')[0]);
  product.images = images;
}

// Result

console.log(product);

const orders = ['name', 'price', 'editions', 'images'];
// 'information'
const ordersInformation = [
  'type',
  'optional',
  'sizes',
  'warning',
  'shippingDays',
  'quote',
  'descriptions',
  'features',
  'approximateDimensions',
  'funFact',
  'series',
  'materials',
];

let finalJSON = '{';

orders.forEach(order => {
  if (product.hasOwnProperty(order)) {
    finalJSON += `"${order}": ${JSON.stringify(product[order])},`;
  }
});

finalJSON += `"information": {`;

ordersInformation.forEach(order => {
  if (product.information.hasOwnProperty(order)) {
    finalJSON += `"${order}": ${JSON.stringify(product.information[order])},`;
  }
});

finalJSON += '}';
finalJSON += '}';

console.log(finalJSON);
