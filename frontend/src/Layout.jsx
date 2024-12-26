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
    } else {
      return <DashboardHeader />;
    }
  };

  const renderFooter = () => {
      if(location.pathname === '/interview-setting' || location.pathname === '/resume' || location.pathname === '/cam-permission' || location.pathname === '/cam-preview1' || location.pathname === '/cam-preview2') {
        return null;
      } else {
        return <Footer />;
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
