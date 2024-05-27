import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { useDarkMode } from '~/hooks';
import { EN_US } from '~/config';
import { flexCenter, flexBetween } from '~/styles/reuseStyles';
import { copyrightContents, linkContents } from '~/dataUI/footer';
import { px924 } from '~/styles/GlobalStyles';
import { LinkFooterUI } from '~/ui';

function FooterRibbon() {
  const { language } = useParams();
  const { isDarkMode } = useDarkMode();

  return (
    <StyledFooterRibbon $isDarkMode={isDarkMode}>
      <FooterRibbonBoxUI>
        <CopyrightUI>{copyrightContents[language]}</CopyrightUI>
        <ListUI>
          {linkContents[language].map((linkContent, index) => (
            <ItemUI key={index} $language={language}>
              <LinkFooterUI
                to={`/${language}${linkContents.links[index]}`}
                $type="ribbon"
              >
                {linkContent}
              </LinkFooterUI>
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
  background-color: #262626;
  ${props => !props.$isDarkMode && 'filter: brightness(1.17)'};
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
  color: #d4d4d4;
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
    margin-left: ${props => `${props.$language === EN_US ? 3 : 0}rem`};

    @media only screen and (max-width: ${px924}) {
      margin-left: 0rem;
    }
  }

  @media only screen and (max-width: ${px924}) {
    margin-top: 0.6rem;
  }
`;

export default FooterRibbon;
