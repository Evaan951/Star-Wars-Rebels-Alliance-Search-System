import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent } from 'react';
import axios from 'axios';
import { UserContext, UserContextType } from '../../Context/UserContext';
import gloablStyle from '../../Styles/global.module.scss'
import style from '../../Styles/Login/login.module.scss'
const Login: React.FC = () => {

  //State nécéssaire au composant.
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const { user, updateUser } = useContext<UserContextType>(UserContext);

  // Fonction de déconnexion. 
  // Reset le context et la session quand l'utilisateur se déconnecte
  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (sessionStorage.getItem('user')) {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      updateUser(null, false);
      setError('')
      setSuccessMsg('Disconnection successful')
    } else {
      updateUser(null, false);
      setError("You're not connected. Please login")
      setSuccessMsg('')
    }

  }


  // Fonction de login
  // Met à jour la session et le context de l'application
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      const token = response.data.token;
      const user = response.data.username;
      // Si token et user ne sont pas null alors on met à jour le context et la session avec les données de l'utilisateur connecté
      if (token && user) {

        sessionStorage.setItem('user', user)
        sessionStorage.setItem('token', token)
        updateUser(user, true);
        setError('');
        setSuccessMsg(`Welcom Jedi ${user}`)
      }

    } catch (error) {
      setError('Connection Failed');
      setSuccessMsg('')
      updateUser(null, false);

    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };


  return (
    <div className={style.mainContainer}>
      <h2>LOGIN</h2>
      {user?.username && <p>You're connected as : <span>{user.username} </span></p>}
      <form className={style.loginForm} onSubmit={handleLogin}>
        {!user.isConnected &&
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button className={gloablStyle.button} type="submit">Login</button>
          </>
        }
        {user.isConnected && <button className={gloablStyle.button} onClick={handleLogout}>Logout</button>}
        {successMsg && <p className={gloablStyle.successMessage}>{successMsg}</p>}
        {error && <p className={gloablStyle.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
