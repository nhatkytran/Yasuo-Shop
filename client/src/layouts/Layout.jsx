import PropTypes from 'prop-types';

import { MAIN_LAYOUT, CATEGORY_LAYOUT, NONE_LAYOUT } from '~/config';
import { Header, Hero, Banner, Footer } from '~/layouts/components';

function Layout({ children, type }) {
  // Hero and Banner get data from URL

  return (
    <div className="app-layout">
      {type !== NONE_LAYOUT && <Header />}

      {type === CATEGORY_LAYOUT && (
        <>
          <Hero />
          <Banner />
        </>
      )}

      {children}

      {type !== NONE_LAYOUT && <Footer />}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.elementType,
  type: PropTypes.oneOf([MAIN_LAYOUT, CATEGORY_LAYOUT, NONE_LAYOUT]),
};

export default Layout;
