import { CognitoAuth } from 'amazon-cognito-auth-js';

export class AuthService {

    constructor() {
        this.auth = this.initCognitoSDK();
        try {
            var curUrl = window.location.href;
            this.auth.parseCognitoWebResponse(curUrl);
        }
        catch (e) {
            console.log(e);
        }
    }

    getIdToken = () => {
        let session = this.auth.getCachedSession();
        if (session) {
            return session.getIdToken();
        }
        return undefined;
    }

    getUsername = () => {
        let idToken = this.getIdToken().getJwtToken();
        if (idToken) {
            var payload = idToken.split('.')[1];
            var tokenobj = JSON.parse(atob(payload));
            return tokenobj.email;
        }

        return this.auth.username;
    }

    isLoggedOn = () => {
        return this.auth.isUserSignedIn();
    }

    signIn = () => {
        this.auth.getSession();
    }

    signOut = () => {
        this.auth.signOut();
    }

    // Initialize a cognito auth object.
    initCognitoSDK = () => {
        var authData = {
            ClientId: '6sbm7bnb3odmp6l30fjhlc35p5',
            AppWebDomain: 'kidsgame-greenelephant.auth.eu-west-1.amazoncognito.com', // Exclude the "https://" part. 
            TokenScopesArray: ['openid', 'email', 'profile'],
            RedirectUriSignIn: 'http://localhost:8080/',
            RedirectUriSignOut: 'http://localhost:8080/',
            UserPoolId: 'eu-west-1_2aaIJvJtX'
        };
        var auth = new CognitoAuth(authData);


        auth.userhandler = {
            onSuccess: function (result) {
                console.log("Sign in success");
                console.log("authservice-user", auth.username, result)
                window.dispatchEvent(new CustomEvent('loggedOn', { detail: { user: auth.username } }));
            },
            onFailure: function (err) {
                console.log("Login-Error!" + err);
                window.dispatchEvent('loggedOff');
            }
        };

        return auth;
    }
}