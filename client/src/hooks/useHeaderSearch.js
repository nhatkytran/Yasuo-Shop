import { useContext } from 'react';
import { HeaderSearchContext } from '~/contexts';

function useHeaderSearch() {
  const context = useContext(HeaderSearchContext);

  if (context === undefined)
    throw new Error(
      'HeaderSearchContext was used outside of HeaderSearchProvider!'
    );

  return context;
}

export default useHeaderSearch;
