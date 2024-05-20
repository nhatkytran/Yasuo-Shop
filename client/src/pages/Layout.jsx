import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet /> {/* Child routes render here */}
      <Footer />
    </div>
  );
}

export default Layout;
