let countCreate = 0;

function createTodo() {
  const { token } = localStorage;  
  event.preventDefault();
  const name = $('#todo_name').val();  
  const description = $('#todo_description').val();  
  const dueDate = $('#todo_dueDate').val();
  countCreate++;

  $.ajax({
    url: `${serverURL}/todos`,
    method: 'POST',
    headers: {
      token
    },
    data: { name, description, dueDate }
  })
    .done((response) => {
      const { message, newTodo } = response;
      Swal.fire({
        position: 'center',
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
      $('#todo_name').val('');  
      $('#todo_description').val('');  
      $('.datepicker').datepicker({ defaultDate: new Date(), setDefaultDate: true, format:'yyyy-mm-dd' });
      $('#no_found').remove();
      $('#todo_list').prepend(`
      <div id="list${countCreate}" class="col s4">
        <div class="card sticky-action">
          <div class="card-image waves-effect waves-block waves-light">
            <img style="object-fit:cover;height:40vh;" class="activator" src="${images[Math.round(Math.random()*(images.length - 1))]}">
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${newTodo.name}<i class="material-icons right">expand_less</i></span>
            <p style="margin-bottom:1vh"><span class="grey-text">by: ${newTodo.creator.name}</span></p>
            <p style="margin-bottom:2vh"><span class="orange-text badge">in 4 days</span></p>
          </div>
          <div class="card-action">
            <p id="todo${countCreate}">

            </p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">Description<i class="material-icons right">close</i></span>
            <p>${newTodo.description}</p>
            <div class="row">
              <div class="col s6">
                <a onClick="deleteTodo('${newTodo._id}', '${countCreate}')" class="red waves-effect waves-light btn"><i class="material-icons left">delete</i>del</a>
              </div>
              <div class="col s6">
                <a class="blue waves-effect waves-light btn"><i class="material-icons left">edit</i>edit</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `)          
      $(`#todo${countCreate}`).append(`
      <a onClick="completeToggle('${newTodo._id}', '${countCreate}', 1)" class="red waves-effect waves-light btn"><i class="material-icons left">close</i>uncompleted</a>
      `)
    })
    .fail((jqXHR, textStatus) => {
      const { responseJSON, status } = jqXHR;
      const { message } = responseJSON;
      console.log('request failed =>', textStatus);
      Swal.fire({
        position: 'center',
        type: 'error',
        title: `${message} (${status})`,
        showConfirmButton: false,
        timer: 1500
      })
    })
}

function deleteTodo(id, index) {
  const { token } = localStorage;  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'green waves-effect waves-light btn',
      cancelButton: 'red waves-effect waves-light btn'
    },
    buttonsStyling: false,
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: '<i class="material-icons left">check</i>Yes, delete it!',
    cancelButtonText: '<i class="material-icons left">close</i>No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: `${serverURL}/todos/${id}`,
        method: 'DELETE',
        headers: {
          token
        }
      })
        .done((response) => {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your todo has been deleted.',
            'success'
          )
          fetchTodos('auth');
        })
        .fail((jqXHR, textStatus) => {
          const { responseJSON, status } = jqXHR;
          const { message } = responseJSON;
          console.log('request failed =>', textStatus);
          Swal.fire({
            position: 'center',
            type: 'error',
            title: `${message} (${status})`,
            showConfirmButton: false,
            timer: 1500
          })
        })
    } else if (
      // Read more about handling dismissals
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your todo is safe :)',
        'error'
      )
    }
  })
}

function fetchTodos(user) {
  const { token } = localStorage;
  const search = $('#search_input').val();
  if (event) {
    event.preventDefault();
  }
  $('#no_found').remove();
  $('#todo_list div').remove();
  $.ajax({
    url: `${serverURL}/${user ? 'user/todos' : `todos`}${search ? `?search=${search}` : ''}`,
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
        <div id="list${i}" class="col s4">
          <div class="card sticky-action">
            <div class="card-image waves-effect waves-block waves-light">
              <img style="object-fit:cover;height:40vh;" class="activator" src="${images[Math.round(Math.random()*(images.length - 1))]}">
            </div>
            <div class="card-content">
              <span class="card-title activator grey-text text-darken-4">${todo.name}<i class="material-icons right">expand_less</i></span>
              <p style="margin-bottom:1vh"><span class="grey-text">by: ${todo.creator.name}</span></p>
              <p style="margin-bottom:2vh"><span class="orange-text badge">in 4 days</span></p>
            </div>
            <div class="card-action">
              <p id="todo${i}">

              </p>
            </div>
            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">Description<i class="material-icons right">close</i></span>
              <p>${todo.description}</p>
              <div class="row">
                <div class="col s6">
                  <a onClick="deleteTodo('${todo._id}', '${i}')" class="red waves-effect waves-light btn"><i class="material-icons left">delete</i>del</a>
                </div>
                <div class="col s6">
                  <a class="blue waves-effect waves-light btn"><i class="material-icons left">edit</i>edit</a>
                </div>
              </div>
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
      const { message } = responseJSON;
      if (status === 404) {
        $('#todo_list').append(`
        <div id="no_found" class="row">
          <div class="col-sm" style="text-align:center;">
            <img src="./assets//noFound.png" alt="noFound" style="width:30%">
            <h5>Not found todos, sorry</h5>
          </div>
        </div>
        `)
      } else {
        console.log('request failed =>', textStatus);
        Swal.fire({
          position: 'center',
          type: 'error',
          title: `${message} (${status})`,
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
      const { message } = responseJSON;
      console.log('request failed =>', textStatus);
      Swal.fire({
        position: 'center',
        type: 'error',
        title: `${message} (${status})`,
        showConfirmButton: false,
        timer: 1500
      })
    })
}

$(document).ready(function() {
  fetchTodos('auth');
  $('#todo_form').submit(function() {
    createTodo();
  })
})