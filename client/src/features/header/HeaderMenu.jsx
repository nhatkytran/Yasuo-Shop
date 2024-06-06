import { TYPE_FEATURED } from '~/config';
import { useHeaderMenu } from '~/hooks';
import { HeaderMenuBoxUI, HeaderMenuUI } from '~/ui';
import { HeaderMenuCategory, HeaderMenuFeatured } from '~/features/header';

function HeaderMenu() {
  const { openName, closeHeaderMenu } = useHeaderMenu();

  if (!openName) return null;

  return (
    <HeaderMenuUI
      onMouseLeave={closeHeaderMenu}
      onClick={event => event.target.closest('a') && closeHeaderMenu()}
    >
      <HeaderMenuBoxUI>
        {openName === TYPE_FEATURED && <HeaderMenuFeatured />}
        {openName !== TYPE_FEATURED && <HeaderMenuCategory />}
      </HeaderMenuBoxUI>
    </HeaderMenuUI>
  );
}

export default HeaderMenu;
