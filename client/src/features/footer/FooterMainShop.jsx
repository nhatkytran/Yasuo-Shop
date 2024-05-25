import { shopContents } from '~/dataUI/footer';
import LinkList from './components/LinkList';

function FooterMainShop() {
  return (
    <div>
      <LinkList data={shopContents} />
    </div>
  );
}

export default FooterMainShop;
