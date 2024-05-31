import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const HeaderMenuContext = createContext();

function HeaderMenuProvider({ children }) {
  const [openName, setOpenName] = useState('');

  const openHeaderMenu = openNameParam => setOpenName(openNameParam);
  const closeHeaderMenu = () => setOpenName('');

  return (
    <HeaderMenuContext.Provider
      value={{ openName, openHeaderMenu, closeHeaderMenu }}
    >
      {children}
    </HeaderMenuContext.Provider>
  );
}

HeaderMenuProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export { HeaderMenuContext, HeaderMenuProvider };
