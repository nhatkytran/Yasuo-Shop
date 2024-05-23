import { CATEGORY_LAYOUT, MAIN_LAYOUT } from '~/config';
import { HomePage, PageNotFound, SalesPage } from '~/pages';

const appPath = path => `/:language${path}`;

const publicRoutes = [
  { path: appPath(''), component: HomePage, layout: MAIN_LAYOUT },
  {
    path: appPath('/category/sales'),
    component: SalesPage,
    layout: CATEGORY_LAYOUT,
  },
  { path: appPath('/*'), component: PageNotFound, layout: MAIN_LAYOUT },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
