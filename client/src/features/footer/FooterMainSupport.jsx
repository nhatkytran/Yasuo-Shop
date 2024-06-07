import { FooterLinkList } from '~/components';
import { suportContents } from '~/dataUI/footer';

function FooterMainSupport() {
  return (
    <div>
      <FooterLinkList data={suportContents} />
    </div>
  );
}

export default FooterMainSupport;
