const profilePictureInput = document.getElementById('profilePictureInput');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const profilePicturePlaceholder = document.querySelector('.profile-picture-placeholder');
const apiUrl = 'https://localhost:7282/api/Usuarios';
const url = window.location.href;
const parts = url.split('#');
let teste = false;
const clientInfoString = parts[1].split('=')[2];
const decodedString = atob(clientInfoString.split('&state')[0]);
localStorage.setItem('userToken', decodedString);
let midiaTagFinal;

profilePictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        profilePicturePreview.src = event.target.result;
        profilePicturePlaceholder.style.display = 'none';
    };

    reader.readAsDataURL(file);
});

// function sendData() {
  

// }

function checkUserTokenAndUsername() {
  localStorage.setItem('userToken', decodedString);
  if (teste == true){
    localStorage.setItem('name', name);
  }
  const name = localStorage.getItem('name');
  const clientInfo = localStorage.getItem('userToken');
  let isLoggedIn = false;
  axios.get('https://localhost:7282/api/Usuarios', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    console.log('Login successful:', response.data);
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].clientInfo === clientInfo) {
        isLoggedIn = true;
        const nomeUsuario = response.data[i].nome
        localStorage.setItem('name', nomeUsuario);
      }
    }
    if (isLoggedIn == true) {
      window.location.href = 'home.html';
    } else {
      console.log('erro clientinfo ou nome')
      localStorage.clear();
    }
  })
  .catch(function(error) {
    console.error('Error logging in:', error);
    showErrorModal('Erro ao fazer login, tente novamente.');
  });
}
$(document).ready(function() {
    console.log('aoooba')
    $("#loginLink").click(function(event) {
      const usernameInput = document.getElementById('name');
      const name = usernameInput.value;
      localStorage.setItem('name', name);
    });
    checkUserTokenAndUsername();
  
  });

  function generateMediaTag(nome, existingMediaTag) {
    const palavras = nome.split(" ");
    
    const primeiroNome = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    
    let mediaTag = primeiroNome;
    
    for (let i = 1; i < palavras.length; i++) {
      const inicial = palavras[i][0].toUpperCase();
      mediaTag += inicial;
    }
    

    if (existingMediaTag) {
      const randomNum = Math.floor(Math.random() * 10000000);
      mediaTag += "_" + randomNum;
    }

    axios.get('https://localhost:7282/api/Usuarios', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      const items = response.data;  
      const mediaTagExists = items.some(item => item.mediaTag === mediaTag);

      if (mediaTagExists) {
        const newMediaTag = generateMediaTag(nome, mediaTag);
        console.log("New media tag: ", newMediaTag);
      } else {
        console.log("Media tag does not exist in response: ", mediaTag);
      }
    })
    .catch(function(error) {
      console.error(error);
    });
    midiaTagFinal = "@" + mediaTag;
    return midiaTagFinal
  }
  

  
const btnRegister = document.getElementById('btnRegister');
btnRegister.addEventListener('click', function(){
  teste = true;
  const name = document.getElementById('name').value;
  const profilePictureInput = document.getElementById('profilePictureInput').files[0];
  localStorage.setItem('userToken', decodedString);
  localStorage.setItem('name', name);
  const regex = /\d/;
  if (!name || regex.test(name)) {
    console.log('Campo inválido');
    return;
  }
  generateMediaTag(name);

  const clientInfo = localStorage.getItem('userToken');
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result;
    const data = {
      clientInfo: clientInfo,
      nome: name,
      midiaTag: midiaTagFinal,
      ImagemUsuarioBase64: base64String
    };
    try {
      const response = await axios.post(apiUrl, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200 || response.status == 201) {
        console.log('Post created successfully:', response.data);
        window.location.href = 'home.html';
      } else {
        console.error('Failed to create post:', response.data);
        showErrorModal('Erro ao cadastrar, tente outro nome de usuário');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      showErrorModal('Erro ao cadastrar, tente outro nome de usuário');
    }
  };
  reader.readAsDataURL(profilePictureInput);
});
