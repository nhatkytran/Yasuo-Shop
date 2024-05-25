import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { EN_US } from '~/config';
import { flexCenter, flexBetween } from '~/styles/reuseStyles';
import { copyrightContents, linkContents } from '~/dataUI/footer';
import { px924 } from '~/styles/GlobalStyles';

function FooterRibbon() {
  const { language } = useParams();

  return (
    <StyledFooterRibbon>
      <FooterRibbonBoxUI>
        <CopyrightUI>{copyrightContents[language]}</CopyrightUI>
        <ListUI>
          {linkContents[language].map((linkContent, index) => (
            <ItemUI key={index} language={language}>
              <LinkUI href={`/${language}${linkContents.links[index]}`}>
                {linkContent}
              </LinkUI>
            </ItemUI>
          ))}
        </ListUI>
      </FooterRibbonBoxUI>
    </StyledFooterRibbon>
  );
}

const StyledFooterRibbon = styled.div`
  width: 100%;
  min-height: 5.6rem;
  background-color: var(--color-neutral-800);
  filter: brightness(1.17);
  position: absolute;
  right: 0;
  bottom: 0;
  ${flexCenter};
`;

const FooterRibbonBoxUI = styled.div`
  width: 100%;
  max-width: 110rem;
  ${flexBetween};
  padding: 0 0.4rem;

  @media only screen and (max-width: ${px924}) {
    flex-direction: column;
    align-items: start;
    padding: 2rem 0.4rem;
  }
`;

const CopyrightUI = styled.p`
  color: var(--color-neutral-300);
  font-family: var(--font-inter-light);
  font-size: 1.2rem;
  letter-spacing: 1px;
  margin-left: 1.6rem;
  margin-right: 1.4rem;

  @media only screen and (max-width: ${px924}) {
    margin-bottom: 0.6rem;
  }
`;

const ListUI = styled.ul`
  list-style: none;
  ${flexBetween};
  flex-wrap: wrap;

  @media only screen and (max-width: ${px924}) {
    justify-content: start;
  }
`;

const ItemUI = styled.li`
  padding: 0 1.6rem;

  &:not(:first-child) {
    margin-left: ${props => `${props.language === EN_US ? 3 : 0}rem`};

    @media only screen and (max-width: ${px924}) {
      margin-left: 0rem;
    }
  }

  @media only screen and (max-width: ${px924}) {
    margin-top: 0.6rem;
  }
`;

const LinkUI = styled.a`
  &:link,
  &:visited {
    display: block;
    color: var(--color-neutral-100);
    font-family: var(--font-inter-medium);
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 1px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default FooterRibbon;
