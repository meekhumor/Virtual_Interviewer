import { Outlet, useLocation } from 'react-router-dom';
import HomeHeader from './components/Header/HomeHeader';
import DashboardHeader from './components/Header/DashboardHeader';
import Footer from './components/Footer/Footer';
import RegisterHeader from './components/Header/RegisterHeader';

function Layout() {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname === '/') {
      return <HomeHeader />;
    } else if (location.pathname === '/register' || location.pathname === '/email-verification') {
      return <RegisterHeader />;
    } else if (location.pathname === '/interview-simulator' || location.pathname === '/animation'){
      return null
    } else {
      return <DashboardHeader />;
    }
  };

  const renderFooter = () => {
      if(location.pathname === '/' || location.pathname === '/dashboard' ) {
        return <Footer />;
      } else {
        return null;
      }
  };

  return (
    <>
      {renderHeader()}
      <Outlet />
      {renderFooter()}
    </>
  );
}

export default Layout;
