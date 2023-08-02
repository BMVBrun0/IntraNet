const apiUrl = 'https://localhost:7282/api/Tarefas';
const name = localStorage.getItem('name');
const token = localStorage.getItem('userToken');
const enviar = document.getElementById('enviar');

const myDiv = document.getElementById("rankingList");
const teste = document.getElementById("lista");

axios.get('https://localhost:7282/api/Usuarios/topScoring')
    .then(response => {
        const data = response.data;
        data.forEach(obj => {
            const tarefaElement = document.createElement('div');
            tarefaElement.classList.add('nomesjs', 'col-12', 'col-md-12', 'm-2');
            
            const imgElement = document.createElement('img');
            imgElement.src = obj.imagemUsuarioBase64;
            imgElement.classList.add('img-circle');
            tarefaElement.appendChild(imgElement);
            
            const nomeElement = document.createElement('span');
            nomeElement.textContent = obj.pontuacao + ' - ' + obj.nome;
            nomeElement.classList.add('ml-2', 'align-middle');
            tarefaElement.appendChild(nomeElement);
            
            myDiv.appendChild(tarefaElement);
        });
    })
    .catch(error => {
        console.error(error);
    });



let contador = 0
axios.get('https://localhost:7282/api/Tarefas')
  .then(response => {
    const data = response.data;
    data.forEach(tarefa => {
      let tarefaId = tarefa.Id;
      axios.get(`https://localhost:7282/api/Usuarios/id?id=${tarefa.usuarioId}`)
        .then(response => {
          const usuario = response.data;
          const base64String = usuario.imagemUsuarioBase64;
          const imgElement = document.createElement('img');
          imgElement.classList.add('rounded-circle');
          imgElement.setAttribute('width', '45');
          imgElement.setAttribute('src', `${base64String}`);
          imgElement.setAttribute('alt', '');
          const card = document.createElement('div');
          card.classList.add('card', 'gedf-card');
          const cardHeader = document.createElement('div');
          cardHeader.classList.add('card-header');

          let dropdownLabel = '';
          if (tarefa.status !== null) {
            if (tarefa.status === 1) {
              dropdownLabel = 'Aprovado';
            } else if (tarefa.status === 2) {
              dropdownLabel = 'Reprovado';
            } else if (tarefa.status === 3) {
              dropdownLabel = 'Implementado';
            } else if (tarefa.status === 4) {
              dropdownLabel = 'Análise';
            }
          } else {
            dropdownLabel = 'Status';
          }

          const headerContent = `
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex justify-content-between align-items-center">
                <div class="mr-2">
                  ${imgElement.outerHTML}
                </div>
                <div class="ml-2">
                  <div class="h5 m-0">${usuario.midiaTag}</div>
                  <div class="h7 text-muted">${usuario.nome}</div>
                </div>
              </div>
              <div>
                <div class="dropdown">
                  <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton_${tarefa.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${dropdownLabel}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton_${tarefa.id}">
                    <a class="dropdown-item" href="#" data-id="1">Aprovado</a>
                    <a class="dropdown-item" href="#" data-id="2">Reprovado</a>
                    <a class="dropdown-item" href="#" data-id="3">Implementado</a>
                    <a class="dropdown-item" href="#" data-id="4">Análise</a>
                  </div>
                </div>
              </div>
            </div>
          `;
          cardHeader.innerHTML = headerContent;
          card.appendChild(cardHeader);

          // Card body
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');

          const bodyContent = `
                <a class="card-link" href="#">
                    <h5 class="card-title">${tarefa.titulo}</h5>
                </a>

                <p class="card-text">
                    ${tarefa.descricao}
                </p>
            `;
          cardBody.innerHTML = bodyContent;
          card.appendChild(cardBody);

          // Card footer
          const cardFooter = document.createElement('div');
          cardFooter.classList.add('card-footer');
          let cardFooterId = `card-footer-${contador}`;
          cardFooter.setAttribute('id', cardFooterId); 
          contador++;
          const footerContent = `
            <button class="btn btn-link btn-comment"><i class="fa fa-comment"></i> Comentário</button>
        `;

          cardFooter.innerHTML = footerContent;
          card.appendChild(cardFooter);
          const container = document.getElementById('container');
          container.appendChild(card);

          let cardFooterElement = document.getElementById(cardFooterId);

          let visible = true;

          const base64String2 = usuario.imagemUsuarioBase64;
          const imgElement2 = document.createElement('img');
          imgElement2.classList.add('rounded-circle');
          imgElement2.setAttribute('width', '45');
          imgElement2.setAttribute('src', `${base64String2}`);
          imgElement2.setAttribute('alt', '');
          const card2 = document.createElement('div');
          card2.classList.add('card2', 'gedf-card');
          card2.style.margin = '10px';
          const cardHeader2 = document.createElement('div');
          cardHeader2.classList.add('card-header');
          const headerContent2 = `
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex justify-content-between align-items-center">
                <div class="mr-2">
                  ${imgElement2.outerHTML}
                </div>
                <div class="ml-2">
                  <div class="h7 ">${tarefa.comentario}</div>
                  <div class="h8 text-muted">${usuario.midiaTag}</div>
                </div>
              </div>
            </div>
          `;
          cardHeader2.innerHTML = headerContent2;
          card2.appendChild(cardHeader2);
          cardFooterElement.insertBefore(card2, null);

          cardHeader2.style.display = 'none';
          card2.style.display = 'none';

          const btnComment = cardFooter.querySelector('.btn-comment');
          let areaDeComentario = null;//document.getElementById('comentarios-container');
          
          btnComment.addEventListener('click', async () => {
            if(tarefa.comentario == null || tarefa.comentario == ""){
              if(!visible){
                areaDeComentario.style.display = 'none';
                visible = true;
              }else{
                areaDeComentario = criarAreaDeComentario( usuario, tarefa);
                cardFooter.appendChild(areaDeComentario);
                visible = false;
              }
            }else{
              if(cardHeader2.style.display == 'block' || card2.style.display == 'block'){
                cardHeader2.style.display = 'none';
                card2.style.display = 'none';
              }else{
                cardHeader2.style.display = 'block';
                card2.style.display = 'block';
              }
            }
            
          });
          const dropdownOptions = cardHeader.querySelectorAll('.dropdown-item');
          dropdownOptions.forEach(option => {
            option.addEventListener('click', function(event) {
              const taskId = event.target.dataset.id;
              postStatus(tarefa,usuario,taskId);
            });
          });
    })
    .catch(error => {
      console.error('Failed to fetch user data:', error);
    });
});
})
.catch(error => {
console.error('Failed to fetch tasks:', error);
});

function postStatus(tarefa,usuario, status) {
  console.log(tarefa);
  tarefa.status = parseInt(status);
  const dropdownButton = document.getElementById(`dropdownMenuButton_${tarefa.id}`);
  let dropdownLabel = ''
  if (status == '1') {
    dropdownLabel = 'Aprovado';
  } else if (status == '2') {
    dropdownLabel = 'Reprovado';
  } else if (status == '3') {
    dropdownLabel = 'Implementado';
  } else {
    dropdownLabel = 'Analise';
  }
  dropdownButton.textContent = `${dropdownLabel}`;
  if (tarefa.status == 1 && tarefa.aprovado != 1) {
      axios.get(`https://localhost:7282/api/Usuarios/id?id=${tarefa.usuarioId}`)
      .then(response => {
          const data = response.data;
          const pontuacao = parseInt(data.pontuacao) + 10;
          const updatedData = {
              id: tarefa.usuarioId,
              pontuacao: pontuacao,
              clientInfo: tarefa.clientInfo,
              nome: tarefa.nome,
              imagemUsuarioBase64: usuario.imagemUsuarioBase64,
              midiaTag: usuario.midiaTag

          };
          return axios.put(`https://localhost:7282/api/Usuarios/${tarefa.usuarioId}`, JSON.stringify(updatedData), {
              headers: { 'Content-Type': 'application/json' }
          });
      })
      .then(response => {
          console.log('Success:', response);
          tarefa.aprovado = 1;
          return axios.put(`https://localhost:7282/api/Tarefas/${tarefa.id}`, JSON.stringify(tarefa), {
              headers: { 'Content-Type': 'application/json' }
          });
      })
      .then(response => {
          console.log('Status updated successfully:', response);
          location.reload();
      })
      .catch(error => {
          console.error(error);
      });
  } else {
      axios.put(`https://localhost:7282/api/Tarefas/${tarefa.id}`, JSON.stringify(tarefa), {
          headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
          console.log('Status updated successfully:', response);
          location.reload();
      })
      .catch(error => {
          console.error(error);
      });
  }
}

enviar.addEventListener('click', function() {
  var titulo = document.getElementById('titulo').value;
  var message = document.getElementById('message').value;
if(titulo != '' && titulo != null && message != '' && message != null){
  let data = {
    nome: name,
    clientInfo: token,
    titulo: titulo,
    descricao: message,
    status: '4'
  };

  axios.post(apiUrl, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Post created successfully:', response);
    location.reload();
  })
  .catch(error => {
    console.error('Error creating post:', error);
  });
}

});
var modalCriado = false;

function openTextAreaModal(obj) {
  axios.get('https://localhost:7282/api/Tarefas/id?id=' + obj.id)
    .then(function(response) {
      var comentario = response.data.comentario; 
      if (comentario !== null) { 
        obj.comentario = comentario; 
      }
      showTextAreaModal(obj); 
    })
    .catch(function(error) {
      console.error('Erro ao obter comentário:', error);
    });
}


function showTextAreaModal(obj) {
  if (modalCriado) {
    return;
  }

  var modalDialog = $('<div class="modal-dialog" role="document"></div>');
  var modalContent = $('<div class="modal-content"></div>');
  var modalHeader = $('<div class="modal-header"><h5 class="modal-title">Comentário</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
  var modalBody = $('<div class="modal-body"></div>');

  var textarea = $('<textarea id="comentario-textarea" class="form-control" rows="5"></textarea>');
  var saveButton = $('<button type="button" class="btn btn-primary">Salvar</button>');

  textarea.val(obj.comentario);

  modalBody.append(textarea);
  modalBody.append(saveButton);

  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);

  if (modalCriado) {
    $('#comentario-modal').remove();
  }

  var modal = $('<div id="comentario-modal" class="modal" tabindex="-1" role="dialog"></div>');
  modal.append(modalDialog);
  $('body').append(modal);
  modal.modal('show');2

  btnEnviar.on('click', function() {
    var comentario = textareaComentario.value();
    if (comentario.trim() !== '') {
      obj.comentario = comentario;

      axios.put('https://localhost:7282/api/Tarefas/' + obj.id, obj)
        .then(function(response) {
          $('#comentario-textarea').val(obj.comentario);
          console.log('Comentário atualizado:', response);
        })
        .catch(function(error) {
          console.error('Erro ao atualizar comentário:', error);
        });
    }
    $('#comentario-modal').modal('hide');
  });

  modal.on('hidden.bs.modal', function() {
    modal.remove();
    modalCriado = false;
  });

  modalCriado = true; 
}

function criarAreaDeComentario(usuario, tarefa) {
  var divComentario = document.createElement('div');
  divComentario.classList.add('area-de-comentario'); 

  var textareaComentario = document.createElement('input');
  textareaComentario.setAttribute('rows', '4');
  textareaComentario.setAttribute('placeholder', 'Escreva um comentário...');
  textareaComentario.classList.add('form-control')
  divComentario.appendChild(textareaComentario);

  var btnEnviar = document.createElement('button');
  btnEnviar.classList.add('btn', 'btn-primary')
  btnEnviar.textContent = 'Enviar';
  btnEnviar.style.marginTop = '10px'
  btnEnviar.style.float = 'left';

  btnEnviar.addEventListener('click', function() {
    var comentario = textareaComentario.value;
    if (comentario.trim() != '') {
      tarefa.comentario = comentario;

      axios.put('https://localhost:7282/api/Tarefas/' + tarefa.id, tarefa)
        .then(function(response) {
          location.reload();
          console.log('Comentário atualizado:', response);
        })
        .catch(function(error) {
          console.error('Erro ao atualizar comentário:', error);
        });
    }
  });

  divComentario.appendChild(btnEnviar);

  return divComentario;
}
