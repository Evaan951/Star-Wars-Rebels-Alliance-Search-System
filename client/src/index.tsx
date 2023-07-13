import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom';
import Login from './Pages/Login/Login';
import People from './Pages/People/People';
import Person from './Pages/People/Person';
import { UserProvider } from './Context/UserContext';
import axiosInstance from './Utils/axiosInstance';
import Starships from './Pages/Starships/Starships';
import Starship from './Pages/Starships/Starship';
import Films from './Pages/Films/Films';
import Film from './Pages/Films/Film';
import Vehicles from './Pages/Vehicles/Vehicles';
import Vehicle from './Pages/Vehicles/Vehicle';
import Species from './Pages/Species/Species';
import Specie from './Pages/Species/Specie';
import Planets from './Pages/Planets/Planets';
import Planet from './Pages/Planets/Planet';
import Home from './Pages/Home';
import Navbar from './Components/Bar/Navbar';
import { Bars } from 'react-loader-spinner';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/people",
        element: <People />,
        loader: async () => {

          try {

            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/people');
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: '/people/:id',
        element: <Person />,
      },
      {
        path: "/starships",
        element: <Starships />,
        loader: async () => {
          try {
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/starships');
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: "/starships/:id",
        element: <Starship />,
      },
      {
        path: "/films",
        element: <Films />,
        loader: async () => {
          try {
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/films');
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: "/films/:id",
        element: <Film />,
      },
      {
        path: "/vehicles",
        element: <Vehicles />,
        loader: async () => {
          try {
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/vehicles');
            console.log(data)
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: "/vehicles/:id",
        element: <Vehicle />,
      },
      {
        path: "/species",
        element: <Species />,
        loader: async () => {
          try {
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/species');
            console.log(data)
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: "/species/:id",
        element: <Specie />,
      },
      {
        path: "/planets",
        element: <Planets />,
        loader: async () => {
          try {
            // Chargement des données depuis l'API
            const { data } = await axiosInstance.get('/planets');
            console.log(data)
            return defer(data);
          } catch (error) {
            // Gestion des erreurs
            return error
          }
        },
      },
      {
        path: "/planets/:id",
        element: <Planet />,
      }
    ],
  }
]);


root.render(
  <React.StrictMode>
    <UserProvider>
        <RouterProvider router={router} fallbackElement={
          <>
            <Navbar />
            <Bars
              height="80"
              width="80"
              color="yellow"
              ariaLabel="bars-loading"
              wrapperStyle={{ display: 'flex', justifyContent: 'center' }}
              wrapperClass=""
              visible={true}
            />
          </>} />

    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
