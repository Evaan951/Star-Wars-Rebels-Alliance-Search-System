import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter, defer, useRouteError } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Components/User/Login';
import People from './Components/People/People';
import Person from './Components/Person/Person';
import { UserProvider } from './Context/UserContext';
import Navbar from './Components/Navbar/Navbar';
import axiosInstance from './Utils/axiosInstance';
import ErrorElement from './Components/ErrorElement';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => ({ message: "Hello Data Router!" }),
    children: [
      {
        path: "/login",
        element: <Login />,
        loader: () => ({ message: "Hello Data Router!" })
      },
      {
        path: "/people",
        element: <People />,
        loader: async () =>  {
          const response = await axiosInstance.get('/people')
          const data = response.data
          return defer(data)

        },
        children: [
          {
            path: '/people/:id',
            element: <Person />,
            loader: () => ({ message: "Hello Data Router!" }),
          }
        ]
      },
    ]
  }
]);


root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} fallbackElement={<p>LoadingFromFallback...</p>} />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
