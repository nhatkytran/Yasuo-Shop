import styled from 'styled-components';

function HeaderSidebar() {
  return <StyledHeaderSidebar>Sidebar</StyledHeaderSidebar>;
}

const StyledHeaderSidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 6rem;
  bottom: 0;
  min-width: 46rem;
  background-color: red;
`;

export default HeaderSidebar;
