import React from 'react';
import Login from './Components/User/Login';
import { UserProvider } from './Context/UserContext';
import Person from './Components/Person/Person';
import People from './Components/People/People';

const App: React.FC = () => {
  return (
    <UserProvider>
      <div>
        <h1>Mon application</h1>
        <Login />
        <Person />
        <People />
      </div>
    </UserProvider>
  );
};

export default App;
