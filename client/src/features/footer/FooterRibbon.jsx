import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { flexCenter, flexBetween } from '~/styles/reuseStyles';
import { copyrightContents, linkContents } from '~/dataUI/footer';

function FooterRibbon() {
  const { language } = useParams();

  return (
    <FooterRibbonUI>
      <FooterRibbonBoxUI>
        <CopyrightUI>{copyrightContents[language]}</CopyrightUI>
        <ListUI>
          {linkContents[language].map((linkContent, index) => (
            <ItemUI key={index}>
              <LinkUI href="">{linkContent}</LinkUI>
            </ItemUI>
          ))}
        </ListUI>
      </FooterRibbonBoxUI>
    </FooterRibbonUI>
  );
}

const FooterRibbonUI = styled.div`
  width: 100%;
  height: 5.6rem;
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
  padding: 0 4rem;
`;

const CopyrightUI = styled.p`
  color: var(--color-neutral-300);
  font-family: var(--font-inter-light);
  font-size: 1.2rem;
  letter-spacing: 1px;
  margin-right: 3rem;
`;

const ListUI = styled.ul`
  list-style: none;
  ${flexBetween};
  flex-wrap: wrap;
`;

const ItemUI = styled.li`
  &:not(:first-child) {
    padding: 0 1.6rem;
    margin-left: 3rem;
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
