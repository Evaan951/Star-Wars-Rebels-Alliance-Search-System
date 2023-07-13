import React from 'react';
import Navbar from './Components/Bar/Navbar';
import { Outlet, useNavigation } from 'react-router-dom';
import { Bars } from 'react-loader-spinner';





const App: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>

      <Navbar />
      {navigation.state === "loading" ? <Bars
        height="80"
        width="80"
        color="yellow"
        ariaLabel="bars-loading"
        wrapperStyle={{display:'flex', justifyContent:'center'}}
        wrapperClass=""
        visible={true}
      />
        :
        <main style={{height:'90vh'}}>
          <Outlet />

        </main>
      }
    </>
  );
};

export default App;
