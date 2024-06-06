import styled from 'styled-components';

const HeaderMenuUI = styled.div`
  width: 100%;
  background-color: #282828;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  z-index: -1;
  animation: 0.15s cubic-bezier(0.42, 0, 0.002, 1) 0s 1 normal none running open;
`;

export default HeaderMenuUI;
