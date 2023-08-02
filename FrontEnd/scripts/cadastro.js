const profilePictureInput = document.getElementById('profilePictureInput');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const profilePicturePlaceholder = document.querySelector('.profile-picture-placeholder');
const apiUrl = 'https://localhost:7282/api/Usuarios';
const url = window.location.href;
const parts = url.split('#');
let teste = false;

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
      const mediaTagExists = items.some(item => item.mediaTag == mediaTag);

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
  localStorage.setItem('name', name);
  const regex = /\d/;
  if (!name || regex.test(name)) {
    console.log('Campo inválido');
    return;
  }
  generateMediaTag(name);
  const reader = new FileReader();
  
  reader.onloadend = async () => {
    const base64String = reader.result;
    const data = {
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
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  reader.readAsDataURL(profilePictureInput);
});
