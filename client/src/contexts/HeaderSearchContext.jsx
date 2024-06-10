import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const HeaderSearchContext = createContext();

function HeaderSearchProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <HeaderSearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </HeaderSearchContext.Provider>
  );
}

HeaderSearchProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export { HeaderSearchContext, HeaderSearchProvider };
