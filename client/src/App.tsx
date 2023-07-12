import React from 'react';
import Login from './Components/User/Login';
import { UserProvider } from './Context/UserContext';
import Navbar from './Components/Navbar/Navbar';
import { Outlet, useNavigation } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';





const App: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>

      <Navbar />
      {navigation.state === "loading" && <Bars
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />}
      <Outlet />
    </>
  );
};

export default App;
