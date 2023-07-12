const Hapi = require('@hapi/hapi');
const axios = require('axios');
const Bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const secretKey = 'jedi_never_loose'; // Remplace avec ta propre clé secrète
const tokenExpiration = '1d'; // Durée d'expiration du jeton


const users = {
    Luke: {
        id: '1',
        username: 'Luke',
        password: '$2b$10$6Hf6m4feX0uKk1yFcbPRt.606BgV.UtrXHSIaaHrLPa8XTJp/ZahS'  // 'DadSucks'
    }
}
// Initialisation du serveur Hapi
const server = Hapi.Server({
    port: 3001,
    host: 'localhost',
    "routes": {
        "cors": true
    }

});

// URL Root de l'api SWAPI
const API_ROOT = 'https://swapi.dev/api'

// Fonction pour vérifier la validité du token
function tokenIsValid(token) {
    if (token)
        try {
            const tokenDecoded = Jwt.token.decode(token)
            Jwt.token.verify(tokenDecoded, secretKey)
            return true
        } catch (err) {
            console.log(err.message)
            return false
        }
}



//Initialisation du serveur
const init = async () => {


    // Configuration de la stratégie d'authentification jwt
    await server.register(require('@hapi/jwt'));

    server.auth.strategy('jwt', 'jwt', {
        keys: secretKey,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 86400,
            timeSkewSec: 15
        },
        validate: (decoded) => ({ isValid: true, credentials: decoded }),
    });
    server.auth.default('jwt');


    server.route({
        method: 'POST',
        path: '/login',
        options: {
            auth: false, // Désactiver l'authentification pour cette route
        },
        handler: async (request, h) => {
            const { username, password } = request.payload;
            const user = users[username];
            const isPasswordValid = Bcrypt.compareSync(password, user.password)
            if (!user || !isPasswordValid) {
                return { token: null };
            }

            const token = Jwt.token.generate(
                { username },
                secretKey,
                { expiresIn: tokenExpiration }
            );
            return { token, username: user.username };
        },
    });
    // Définit une route pour vérifier la validité du token et du nom d'utilisateur
    server.route({
        method: 'POST',
        path: '/checkUserSession',
        options: {
            auth: false,
        },
        handler: (request, h) => {
            const { user, token } = request.payload;
            const currentUser = users[user];
            // Vérifie si l'utilisateur existe et si le token correspond
            const isValidToken = tokenIsValid(token)
            if (currentUser && isValidToken) {
                return { isValid: true };
            } else {
                return { isValid: false };
            }
        }
    });




    // Déclaration de la route principale de notre API
    // Permet de rechercher dans l'api de SWAPI si l'utilsateur est connecté.
    server.route({
        method: 'GET',
        path: '/{endpoint}',
        options: {
            auth: 'jwt'
        },
        handler: async (request, h) => {
            const { isAuthenticated, credentials } = request.auth;
         
            //Récupération des paramètres de l'URL
            const { endpoint } = request.params;
            const { search } = request.query;
            // Création de l'URL (on vérifie si l'utilisateur fait une recherche ou non)
            const url = `${API_ROOT}/${endpoint}${search ? `?search=${search}` : ''}`;
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                console.log(error.message)
                throw new Error('Erreur lors de la recherche');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{endpoint}/{id}',
        options: {
            auth: 'jwt'
        },
        handler: async (request, h) => {
            const { isAuthenticated, credentials } = request.auth;
         
            //Récupération des paramètres de l'URL
            const { endpoint,id } = request.params;
            const { search } = request.query;
            // Création de l'URL (on vérifie si l'utilisateur fait une recherche ou non)
            const url = `${API_ROOT}/${endpoint}/${id}${search ? `?search=${search}` : ''}`;
            try {
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                
                throw new Error(error.message)
            }
        }
    });
    try {
        await server.start();
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
    console.log('Serveur en écoute sur', server.info.uri);
};

//Démarrage du server
init();
