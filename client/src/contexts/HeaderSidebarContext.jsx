import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const HeaderSidebarContext = createContext();

function HeaderSidebarProvider({ children }) {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [sidebarSubmenuName, setSidebarSubmenuName] = useState('');

  const openHeaderSidebar = () => setIsSidebarOpened(true);

  const closeHeaderSidebar = () => {
    setIsSidebarOpened(false);
    setSidebarSubmenuName('');
  };

  const openHeaderSidebarSubmenu = openNameParam =>
    setSidebarSubmenuName(openNameParam);

  const closeHeaderSidebarSubmenu = () => setSidebarSubmenuName('');

  useEffect(() => {
    if (!isSidebarOpened) return;

    const autoCloseSidebar = () => {
      if (window.innerWidth > 924) {
        closeHeaderSidebar();
        window.removeEventListener('resize', autoCloseSidebar);
      }
    };

    window.addEventListener('resize', autoCloseSidebar);

    return () => window.removeEventListener('resize', autoCloseSidebar);
  }, [isSidebarOpened]);

  return (
    <HeaderSidebarContext.Provider
      value={{
        isSidebarOpened,
        sidebarSubmenuName,
        openHeaderSidebar,
        closeHeaderSidebar,
        openHeaderSidebarSubmenu,
        closeHeaderSidebarSubmenu,
      }}
    >
      {children}
    </HeaderSidebarContext.Provider>
  );
}

HeaderSidebarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export { HeaderSidebarContext, HeaderSidebarProvider };
