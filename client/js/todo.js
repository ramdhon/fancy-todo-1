const images = [
  'https://images.pexels.com/photos/2216613/pexels-photo-2216613.jpeg',
  'https://images.pexels.com/photos/2220336/pexels-photo-2220336.jpeg',
  'https://images.pexels.com/photos/2235966/pexels-photo-2235966.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg'
]

function fetchTodos(user) {
  const { token } = localStorage;
  const search = $('#search_input').val();
  if (event) {
    event.preventDefault();
  }
  // $('#titleRepos').empty();
  // $('#titleRepos').append(`${user ? user === 'auth' ? 'My' : user : 'Global'} Repositories`);
  $('#no_ound').remove();
  $('#todo_list div').remove();
  $.ajax({
    url: `${serverURL}/${user ? 'user/todos' : `/todos`}${search ? `?search=${search}` : ''}`,
    method: 'GET',
    headers: {
      token
    }
  })
    .done((response) => {
      const { todos } = response;
      let i = 0;
      for(todo of todos) {
        $('#todo_list').append(`
        <div class="col s4">
          <div class="card sticky-action">
            <div class="card-image waves-effect waves-block waves-light">
              <img style="object-fit:cover;height:40vh;" class="activator" src="${images[Math.round(Math.random()*(images.length - 1))]}">
            </div>
            <div class="card-content">
              <span class="card-title activator grey-text text-darken-4">${todo.name}<span style="border-radius:3px" class="orange-text badge">in 4 days</span><i class="material-icons right">expand_less</i></span>
              <p style="margin-bottom:2vh"><span class="grey-text">by: ${todo.creator.name}</span></p>
              <p id="todo${i}">

              </p>
            </div>
            <div class="card-action">
              <div class="row">
                <div class="col s6">
                  <a class="red waves-effect waves-light btn"><i class="material-icons left">delete</i>del</a>
                </div>
                <div class="col s6">
                  <a class="blue waves-effect waves-light btn"><i class="material-icons left">edit</i>edit</a>
                </div>
              </div>
            </div>
            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">Description<i class="material-icons right">close</i></span>
              <p>${todo.description}</p>
            </div>
          </div>
        </div>
        `)        
        if (!todo.status) {
          $(`#todo${i}`).append(`
          <a onClick="completeToggle('${todo._id}', '${i}', 1)" class="red waves-effect waves-light btn"><i class="material-icons left">close</i>uncompleted</a>
          `)
        } else {
          $(`#todo${i}`).append(`
          <a onClick="completeToggle('${todo._id}', '${i}', 0)"class="green waves-effect waves-light btn"><i class="material-icons left">check</i>completed</a>
          `)
        }
        i++;
      }
    })
    .fail((jqXHR, textStatus) => {
      const { responseJSON, status } = jqXHR;
      const { message, register_token } = responseJSON;
      if (status === 404) {
        $('#todo_list').append(`
        <div id="no_found" class="row">
          <div class="col-sm" style="text-align:center;">
            <img src="./assets//noFound.png" alt="noFound" style="width:30%">
            <h5>Not found, sorry <i class="far fa-sad-tear"></i></h5>
          </div>
        </div>
        `)
      } else {
        console.log('request failed =>', textStatus);
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'internal server error (500)',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
}

function completeToggle(id, index, status) {
  const { token } = localStorage;
  $.ajax({
    url: `${serverURL}/todos/${id}`,
    method: 'PATCH',
    headers: {
      token
    },
    data: {
      status
    }
  })
    .done((response) => {
      $(`#todo${index}`).empty();
      if(status) {
        $(`#todo${index}`).append(`
          <a onClick="completeToggle('${id}', '${index}', 0)"class="green waves-effect waves-light btn"><i class="material-icons left">check</i>completed</a>
        `)
      } else {
        $(`#todo${index}`).append(`
          <a onClick="completeToggle('${id}', '${index}', 1)" class="red waves-effect waves-light btn"><i class="material-icons left">close</i>uncompleted</a>
        `)
      }
    })
    .fail((jqXHR, textStatus) => {
      const { responseJSON, status } = jqXHR;
      const { message, register_token } = responseJSON;
      if (status !== 401) {
        console.log('request failed =>', textStatus);
        Swal.fire({
          position: 'center',
          type: 'error',
          title: `${message} (${status})`,
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        console.log('request failed =>', textStatus);
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'internal server error (500)',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
}

$(document).ready(function() {
  fetchTodos('auth');
})