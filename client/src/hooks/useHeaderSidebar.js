import { useContext } from 'react';
import { HeaderSidebarContext } from '~/contexts';

function useHeaderSidebar() {
  const context = useContext(HeaderSidebarContext);

  if (context === undefined)
    throw new Error(
      'HeaderSidebarContext was used outside of HeaderSidebarProvider!'
    );

  return context;
}

export default useHeaderSidebar;
