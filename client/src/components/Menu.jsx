import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const MenuContext = createContext();

function Menu({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = openNameParam => setOpenName(openNameParam);

  return (
    <MenuContext.Provider value={{ openName, open, close }}>
      {children}
    </MenuContext.Provider>
  );
}

function Open({ render }) {
  const { open } = useContext(MenuContext);

  return render(open);
}

function Window({ render }) {
  const { openName, close } = useContext(MenuContext);

  if (!openName) return null;

  return render(openName, close);
}

Menu.Open = Open;
Menu.Window = Window;

Menu.propTypes = { children: PropTypes.arrayOf(PropTypes.element).isRequired };
Open.propTypes = { render: PropTypes.func.isRequired };
Window.propTypes = { render: PropTypes.func.isRequired };

export default Menu;
