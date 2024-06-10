import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import PropTypes from 'prop-types';

import { AiOutlineCloseUI, SearchInputUI } from '~/ui';
import { searchPlaceholders } from '~/dataUI/header';
import { useHeaderSearch } from '~/hooks';

function HeaderSearchInput({ type }) {
  const { language } = useParams();
  const { searchValue, setSearchValue } = useHeaderSearch();

  return (
    <>
      <SearchInputUI
        $type={type}
        type="text"
        placeholder={searchPlaceholders[language]}
        value={searchValue}
        onChange={event => setSearchValue(event.target.value)}
      />

      {!searchValue && <AiOutlineSearchUI />}
      {searchValue && <AiOutlineCloseUI onClick={() => setSearchValue('')} />}
    </>
  );
}

const AiOutlineSearchUI = styled(AiOutlineSearch)`
  display: block;
`;

HeaderSearchInput.propTypes = {
  type: PropTypes.oneOf(['menu', 'sidebar']).isRequired,
};

export default HeaderSearchInput;
