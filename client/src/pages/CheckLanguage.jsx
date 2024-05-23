import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SUPPORTED_LANGUAGES } from '~/config';

function CheckLanguage({ children }) {
  const { language } = useParams();

  if (!SUPPORTED_LANGUAGES.includes(language))
    throw new Error(`Invalid language: '${language}' is not supported!`);

  return children;
}

CheckLanguage.propTypes = { children: PropTypes.element };

export default CheckLanguage;
