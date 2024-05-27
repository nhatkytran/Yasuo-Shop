import { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useLocalStorageState } from '~/hooks';
import { DARK_MODE, LIGHT_MODE } from '~/config';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, 'isDarkMode');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    document.documentElement.classList.add(isDarkMode ? DARK_MODE : LIGHT_MODE);
    document.documentElement.classList.remove(
      isDarkMode ? LIGHT_MODE : DARK_MODE
    );
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

DarkModeProvider.propTypes = { children: PropTypes.element.isRequired };

export { DarkModeContext, DarkModeProvider };
