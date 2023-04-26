const btnRegister = document.getElementById("btnRegister");
btnRegister.addEventListener("click", async function(){
  try {
    const response = await myMSALObj.loginRedirect(loginRequest);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});


  const msalConfig = {
    auth: { 
      clientId: '01f78274-5ee7-4e66-adb2-72069e961243',
      authority: 'https://login.microsoftonline.com/cc4cd8a5-6f97-4acf-8d83-530f3ca78f80',
      redirectUri: 'https://localhost:8000/cadastro.html',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  };
  
  const loginRequest = {
    scopes: ['User.Read'],
  };
  
  const myMSALObj = new msal.PublicClientApplication(msalConfig);

  window.addEventListener('beforeunload', function() {
    
    myMSALObj.clearCache();
    console.log('limpou')
  });
  // async function signIn() {
    

  // }
  
  
  function signOut() {
    myMSALObj.logout();
  }
  
  function getTokenRedirect() {
    return myMSALObj.acquireTokenSilent(loginRequest).catch((error) => {
      console.log('Silent token acquisition failed. Acquiring token using redirect');
      if (error instanceof msal.InteractionRequiredAuthError) {
        return myMSALObj.acquireTokenRedirect(loginRequest);
      }
    });
  }
  
  async function callAPI() {
    const tokenResponse = await getTokenRedirect();
    if (!tokenResponse || !tokenResponse.accessToken) {
      console.log('Failed to acquire access token');
      return;
    }
    const headers = new Headers();
    const bearer = `Bearer ${tokenResponse.accessToken}`;
    headers.append('Authorization', bearer);
    const options = {
      method: 'GET',
      headers: headers,
    };
    const apiUrl = 'https://graph.microsoft.com/v1.0/me';
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    console.log(data);
  }
  window.addEventListener('load', () => {
    myMSALObj.handleRedirectPromise()
      .then((response) => {
        if (response) {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  
  