import React, { MouseEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../../Styles/Bar/Navbar.module.scss'
import { UserContext, UserContextType } from "../../Context/UserContext";


const Navbar: React.FC<{}> = () => {

  const naviguate = useNavigate();

  const { user, updateUser } = useContext<UserContextType>(UserContext)


  // Fonction de déconnexion. 
  // Reset le context et la session quand l'utilisateur se déconnecte
  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault();
    if (sessionStorage.getItem('user')) {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      updateUser(null, false);

    } else {
      updateUser(null, false);
    }

  }


  return (
    <header className={styles.navbar}>

      <h4 onClick={()=> naviguate('/')} className={styles.title}>Star Wars Rebels Alliance Search System</h4>
      <div className={styles.navContainer}>
        <Link to='/' className={styles.linkNav}>Home</Link>
        {!user.isConnected ? <svg onClick={() => naviguate('/login')} className={styles.userIcon} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg> : <svg onClick={handleLogout} className={styles.userIcon} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>}
      </div>


    </header>
  );
};

export default Navbar;