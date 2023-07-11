import React, { useState, FormEvent, ChangeEvent, useContext, MouseEvent } from 'react';
import axios from 'axios';
import { UserContext, UserContextType } from '../../Context/UserContext';

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
      setSuccessMsg('Vous êtes bien déconnecté')
    } else {
      updateUser(null, false);
      setError("Vous n'êtes pas connecté")
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
        setSuccessMsg(`Bienvenu Jedi ${user}`)
      }

    } catch (error) {
      setError('Échec de la connexion');
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
    <div>
      <h2>Connexion</h2>
      {user?.username && <p>{user.username} / {user.isConnected ? 'connecté' : ''}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={handlePasswordChange}
        />
        {!user.isConnected && <button type="submit">Se connecter</button>}
        {user.isConnected && <button onClick={handleLogout}>Logout</button>}
        {successMsg && <p>{successMsg}</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
