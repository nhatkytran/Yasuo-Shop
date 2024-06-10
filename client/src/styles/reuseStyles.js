import { css } from 'styled-components';

// Layouts //////////

export const customScrollbar = css`
  &::-webkit-scrollbar {
    width: 0.6rem;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--color-neutral-400);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-neutral-500);
    box-shadow: 0 3px 13px 1px rgba(0, 0, 0, 0.12);
    -webkit-box-shadow: 0 3px 13px 1px rgba(0, 0, 0, 0.12);
  }
`;

const flexAlignCenter = css`
  display: flex;
  align-items: center;
`;

export const flexCenter = css`
  ${flexAlignCenter};
  justify-content: center;
`;

export const flexBetween = css`
  ${flexAlignCenter};
  justify-content: space-between;
`;

export const flexStart = css`
  ${flexAlignCenter};
  justify-content: start;
`;

// Items //////////

export const inputSearchSVG = css`
  height: 2.2rem;
  width: 2.2rem;
  margin-left: 0.6rem;
  fill: #fff;
`;
