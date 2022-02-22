import { useState, useEffect } from "react";
import poolDetails from "../lib/poolDetails";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { AlertFn } from "../AppProvider";
import { RouterHook } from "./useRouter";

export interface UserHook {
  isAuthenticated: boolean;
  isChangePassword: boolean;
  isForgotPassword: boolean;
  headers: {
    get: {
      'x-amz-access-token'?: string,
      'x-amz-id-token'?: string
    },
    post: {
      'Content-Type': string,
      'x-amz-access-token'?: string,
      'x-amz-id-token'?: string
    }
  }
  role: string;
  name: string;
  login: (Username: string, Password: string) => void;
  completePasswordChallenge: (password: string) => void;
  forgotPassword: (Username?: string) => void;
  confirmPassword: (code: string, password: string) => void;
  signOut: () => void
}

export const mockUseUser:UserHook = {
  isAuthenticated: false,
  isChangePassword: false,
  isForgotPassword: false,
  headers: {
    get: {
    },
    post: {
      'Content-Type': 'application/json'
    }
  },
  role: 'barista',
  name: '',
  login: () => {},
  completePasswordChallenge: () => {},
  forgotPassword: () => {},
  confirmPassword: () => {},
  signOut: () => {}
}

export default function useUser (router: RouterHook, alert: AlertFn):UserHook {
  // config
  let pool = new AmazonCognitoIdentity.CognitoUserPool (poolDetails);
  const [user, setUser] = useState<AmazonCognitoIdentity.CognitoUser | null> (pool.getCurrentUser ());
  // private state
  const [accessToken, setAccessToken] = useState<string> ('');
  const [idToken, setIdToken] = useState<string> ('');
  const [refreshToken, setRefreshToken] = useState<AmazonCognitoIdentity.CognitoRefreshToken | null> (null);
  const headers = {
    get: {
      'x-amz-access-token': accessToken || undefined,
      'x-amz-id-token': idToken
    },
    post: {
      'Content-Type': 'application/json',
      'x-amz-access-token': accessToken || undefined,
      'x-amz-id-token': idToken
    }
  };
  
  // public state mgmt
  const [isAuthenticated, setIsAuthenticated] = useState<boolean> (false);
  const [isChangePassword, setChangePassword] = useState<boolean> (false);
  const [isForgotPassword, setIsResetPassword] = useState<boolean> (false);
  const [userAttributes, setUserAttributes] = useState<AmazonCognitoIdentity.CognitoUserAttribute | null> (null);
  const [role, setRole] = useState<string> ('barista');
  const [name, setName] = useState<string> ('');

  // get role/name attribute
  const getAttributes = () => {
    user?.getUserAttributes ((err, result) => {
      if (result) {
        setRole (result.find (attr => attr.getName () === 'custom:role')?.getValue () || 'barista');
        setName (result.find (attr => attr.getName () === 'name')?.getValue () || '');
      }
    })
  }

  // private method gets access and refresh tokens - call after authenticating
  const retrieveAccessTokens = async () => {
    user?.getSession ((error: any, session: AmazonCognitoIdentity.CognitoUserSession) => {
      if (error) return;
      setAccessToken (session.getAccessToken ().getJwtToken ());
      setIdToken (session.getIdToken ().getJwtToken ());
      setRefreshToken (new AmazonCognitoIdentity.CognitoRefreshToken ({RefreshToken: session.getRefreshToken ().getToken ()}));
      setIsAuthenticated (true);
    });
  };

  // private method - refresh session should be called on init
  const refreshSession = async () => {
    if (user && refreshToken) user.refreshSession (refreshToken, err => {
      if (err) return Promise.reject (err);
      return retrieveAccessTokens ();
    })
  };

  // public method - log user in with username/password
  const login = async (Username: string, Password: string) => new Promise<void> (async (resolve, reject) => {
    let details = new AmazonCognitoIdentity.AuthenticationDetails ({Username, Password});
    if (!isAuthenticated) {
      let _user = new AmazonCognitoIdentity.CognitoUser ({Username, Pool: pool});
      setUser (_user);
      _user.authenticateUser (details, {
        onSuccess: async () => {
          setIsAuthenticated (true);
          resolve ();
        },
        onFailure: error => {
          console.log ('failure')
          alert ('error', `${error}`);
          reject (error);
        },
        newPasswordRequired: attrs => {
          delete attrs.email_verified;
          delete attrs.phone_number_verified;
          delete attrs['custom:role'];
          delete attrs.USERNAME;
          delete attrs.name;
          setUserAttributes (attrs);
          setChangePassword (true);
        }
      });
    }
  });

  const completePasswordChallenge = (password:string) => {
    user?.completeNewPasswordChallenge (password, userAttributes, {
      onSuccess: () => {
        init ();
        alert ('info', 'Your password has been changed');
        setChangePassword (false);
      },
      onFailure: (e: any) => {
        alert ('error', `${e}`);
      }
    })
  };

  const forgotPassword = (Username?: string) => {
    let _user = user;
    if (!user && Username) {
      _user = new AmazonCognitoIdentity.CognitoUser ({Username, Pool: pool});
      setUser (_user);
    }
    console.log (user, _user);
    if (!_user) return;
    _user.forgotPassword ({
      onSuccess: () => {
        setIsResetPassword (true);
        alert ('info', 'We sent a verification code to your email :)');
      },
      onFailure: () => {
        alert ('error', 'Cannot reset password at this time, please contact an administrator')
      }
    })
  }
  
  const confirmPassword = (code: string, password: string) => {
    user?.confirmPassword (code, password, {
      onSuccess: () => {
        setIsResetPassword (false);
        alert ('info', 'Successfully reset password!')
      },
      onFailure: err => {
        alert ('error', `${err}`);
      }
    })
  }

  // public sign out of account
  const signOut = async () => {
    try {
      await user?.signOut();
      window.location.reload ();
    } catch (e) {
      alert ('error', 'Could not complete sign out at this time, please contact an administrator')
    }
  }

  // private method
  async function init () {
    retrieveAccessTokens ();
    refreshSession ();
  };

  useEffect (() => {
    init ();
  }, []);

  useEffect (() => {
    if (isAuthenticated) {
      getAttributes ();
      init ();
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isChangePassword,
    isForgotPassword,
    headers,
    role,
    name,
    login,
    completePasswordChallenge,
    forgotPassword,
    confirmPassword,
    signOut
  };
}