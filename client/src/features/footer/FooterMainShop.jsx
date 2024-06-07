import { FooterLinkList } from '~/components';
import { shopContents } from '~/dataUI/footer';

function FooterMainShop() {
  return (
    <div>
      <FooterLinkList data={shopContents} />
    </div>
  );
}

export default FooterMainShop;
