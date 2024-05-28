import { css } from 'styled-components';

// Layouts //////////

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
