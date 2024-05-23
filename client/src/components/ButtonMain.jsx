import styled from 'styled-components';
import PropTypes from 'prop-types';

import { flexCenter } from '~/styles/reuseStyles';

function ButtonMain({ content }) {
  return (
    <StyledButtonMain>
      <WrapUI>
        <SlashUI>/</SlashUI>
        <ContentUI>{content}</ContentUI>
      </WrapUI>
    </StyledButtonMain>
  );
}

const StyledButtonMain = styled.button`
  background-color: var(--color-red-600);
  color: var(--color-white);
  font-family: Inter-Light, monospace, sans-serif;
  padding: 0 3.4rem;
  margin-top: 2.6rem;
  border-radius: 4.6rem;
  cursor: pointer;

  &:hover *::before {
    transform: none;
  }
`;

const WrapUI = styled.div`
  height: 4.6rem;
  ${flexCenter}
`;

const SlashUI = styled.span`
  font-size: 1.6rem;
  margin-right: 6px;
`;

const ContentUI = styled.span`
  font-size: 1.6rem;
  letter-spacing: 1px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 1px;
    background-color: var(--color-white);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }
`;

ButtonMain.propTypes = { content: PropTypes.string };

export default ButtonMain;
