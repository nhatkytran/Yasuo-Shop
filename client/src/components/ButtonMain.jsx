import styled from 'styled-components';
import PropTypes from 'prop-types';

import { flexCenter } from '~/styles/reuseStyles';
import { px1024, px624 } from '~/styles/GlobalStyles';

function ButtonMain({ content, onClick }) {
  return (
    <StyledButtonMain onClick={onClick}>
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
  font-family: var(--font-inter-light);
  padding: 0 3.4rem;
  margin-top: 2.6rem;
  border-radius: 4.6rem;
  background-color: var(--color-red-600);
  background-image: linear-gradient(
    -185deg,
    var(--color-red-600) 49.5%,
    var(--color-red-700) 50.5%
  );
  background-size: 100% 255%;
  background-position: 50% 0px;
  transition: background-color 0.35s cubic-bezier(0.12, 0.71, 0.31, 0.89) 0s,
    background-position 0.35s cubic-bezier(0.12, 0.71, 0.31, 0.89) 0s;
  cursor: pointer;

  &:hover {
    background-color: var(--color-red-700);
    background-position: 0px 100%;

    *::before {
      transform: none;
    }
  }

  @media only screen and (max-width: ${px1024}) {
    margin-top: 1rem;
  }

  @media only screen and (max-width: ${px624}) {
    margin-top: 0.6rem;
  }
`;

const WrapUI = styled.div`
  height: 4.6rem;
  ${flexCenter}
`;

const SlashUI = styled.span`
  font-size: 1.6rem;
  margin-right: 6px;

  @media only screen and (max-width: ${px624}) {
    font-size: 1.4rem;
  }
`;

const ContentUI = styled.span`
  font-size: 1.6rem;
  letter-spacing: 1px;
  position: relative;

  @media only screen and (max-width: ${px624}) {
    font-size: 1.4rem;
  }

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

ButtonMain.propTypes = {
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ButtonMain;
