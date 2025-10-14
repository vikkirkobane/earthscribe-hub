import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean; // Optional prop to show/hide sidebar
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <div className="md:fixed md:block md:w-64 md:h-full z-10"><Sidebar /></div>}
        <main className={`flex-1 ${showSidebar ? 'md:ml-64' : ''}`}>
          <div className="w-full px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;