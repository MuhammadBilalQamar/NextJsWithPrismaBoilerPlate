import '../../styles/globalsPublicLayout.scss';
import QueryWrapper from '@/components/shared/queryWrapper/queryWrapper';
import GlobalWrapper from '@/components/shared/globalWrapper/globalWrapper';
import Footer from '@/components/layout/Footer/Footer';
import Navbar from '@/components/layout/Navbar/Navbar';
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS

export default async function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <GlobalWrapper session={{ user: null }}>
        <QueryWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'black' }}>
            <Navbar />
            <div className="flex-1 items-center justify-center flex flex-col">
              {children}
            </div>
            <Footer />
          </div>
        </QueryWrapper>
      </GlobalWrapper>
    </>
  );
}