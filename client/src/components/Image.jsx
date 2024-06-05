import { createElement, useState } from 'react';
import PropTypes from 'prop-types';

import noImage from '/images/no-image.png';

function Image({ UI, ...props }) {
  const [fallback, setFallback] = useState('');

  const options = { ...props, onError: () => setFallback(noImage) };

  if (fallback) options.src = fallback;

  return createElement(UI, options);
}

Image.propTypes = {
  UI: PropTypes.elementType.isRequired,
  props: PropTypes.any,
};

export default Image;
