import { suportContents } from '~/dataUI/footer';
import LinkList from './components/LinkList';

function FooterMainSupport() {
  return (
    <div>
      <LinkList data={suportContents} />
    </div>
  );
}

export default FooterMainSupport;
