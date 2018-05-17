import { CognitoAuth } from 'amazon-cognito-auth-js';

var auth = initCognitoSDK();

export function login() {
    auth.getSession();
}

export function logout() {
    auth.signOut();
}

export function isLoggedIn() {
    return auth.isUserSignedIn();
}

export function validateCallback() {
    console.log("validating callback");
    var curUrl = window.location.href;
    auth.parseCognitoWebResponse(curUrl);
}
export function getIdToken() {
    let session = auth.getCachedSession();
    if (session) {
        return session.getIdToken();
    }
    return undefined;
}

function initCognitoSDK() {
    var authData = {
        ClientId: '6sbm7bnb3odmp6l30fjhlc35p5',
        AppWebDomain: 'kidsgame-greenelephant.auth.eu-west-1.amazoncognito.com', // Exclude the "https://" part. 
        TokenScopesArray: ['openid', 'email', 'profile'],
        RedirectUriSignIn: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://kidsgame.greenelephant.io/callback',
        RedirectUriSignOut: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/logout' :'https://kidsgame.greenelephant.io/logout',
        UserPoolId: 'eu-west-1_2aaIJvJtX'
    };

    let auth = new CognitoAuth(authData);


    auth.userhandler = {
        onSuccess: function (result) {
            console.log("Sign in success");
        },
        onFailure: function (err) {
            console.log("Login-Error!" + err);
        }
    };

    return auth;
}