import { useContext } from 'react';
import { HeaderMenuContext } from '~/contexts';

function useHeaderMenu() {
  const context = useContext(HeaderMenuContext);

  if (context === undefined)
    throw new Error(
      'HeaderMenuContext was used outside of HeaderMenuProvider!'
    );

  return context;
}

export default useHeaderMenu;
