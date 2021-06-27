import { PageHeader } from 'doif-react-kit';
import { Helmet } from 'react-helmet-async';

interface PageHeaderInfoProps {
  pageData: any;
}

function PageHeaderInfo({ pageData }: PageHeaderInfoProps) {
  return (
    <>
      <Helmet>
        <title>Project V - {pageData.menuName}</title>
      </Helmet>

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
    </>
  );
}

export default PageHeaderInfo;
