const serverURL = 'http://localhost:3000'

function moveRegister() {
  $('#login_page').hide();
  $('#register_page').show();
}

function moveLogin() {
  $('#login_page').show();
  $('#register_page').hide();
}

function onSignIn(googleUser) {
  var { id_token } = googleUser.getAuthResponse();
  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  // console.log(`Token: ${id_token}`);
  $.ajax({
    url: `${serverURL}/oauth/google/login`,
    method: 'POST',
    headers: {
      id_token,
    },
  })
    .done((response) => {
      const { message, token, user } = response;
      if (!localStorage.token) {
        Swal.fire({
          position: 'center',
          type: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500
        })
      }
      localStorage.setItem('token', token);
      fetchTodos('auth');
      logCheck(user);
    })
    .fail((jqXHR, textStatus) => {
      const { responseJSON, status } = jqXHR;
      const { message, register_token } = responseJSON;
      if (status === 404) {
        $('#oauth_page').show();
        $('#login_page').hide();
        localStorage.setItem('register_token', register_token);
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

function onRegister() {
  event.preventDefault();
  const { register_token } = localStorage;
  localStorage.removeItem('register_token');
  const password = $('#oauth_password').val();
  $.ajax({
    url: `${serverURL}/oauth/google/register`,
    method: 'POST',
    headers: {
      register_token
    },
    data: {
      password,
    },
  })
    .done((response) => {
      const { message, token, user } = response;
      if (!localStorage.token) {
        Swal.fire({
          position: 'center',
          type: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500
        })
      }
      localStorage.setItem('token', token);
      fetchTodos('auth');
      $('#oauth_password').val('');
      logCheck(user);
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

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token');
    logCheck();
    Swal.fire({
      position: 'center',
      type: 'success',
      title: 'logout success',
      showConfirmButton: false,
      timer: 1500
    })
    console.log('User signed out.');
  });
}

function register() {
  event.preventDefault();
  const name = $('#register_full_name').val();
  const email = $('#register_email').val();
  const password = $('#register_password').val();

  $.ajax({
    url: `${serverURL}/register`,
    method: 'POST',
    data: { name, email, password }
  })
    .done((response) => {
      const { message } = response;
      Swal.fire({
        position: 'center',
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
      $('#register_full_name').val('');
      $('#register_email').val('');
      $('#register_password').val('');
      moveLogin();
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

function login() {
  event.preventDefault();
  const email = $('#login_email').val();
  const password = $('#login_password').val();

  $.ajax({
    url: `${serverURL}/login`,
    method: 'POST',
    data: { email, password }
  })
    .done((response) => {
      const { message, token, user } = response;
      if (!localStorage.token) {
        Swal.fire({
          position: 'center',
          type: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500
        })
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      fetchTodos('auth');
      $('#login_email').val('');
      $('#login_password').val('');
      logCheck(user);
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

function logCheck(user) {
  if (!localStorage.token) {
    $('#app').hide();
    $('#welcome_page').show();
    $('#login_page').show();
    $('#register_page').hide();
    $('#oauth_page').hide();
  } else {
    $('#app').show();
    $('#welcome_page').hide();
    if(user) {
      $('#welcome_user').html(`Welcome, ${user}`);
    } else if (localStorage.user) {
      $('#welcome_user').html(`Welcome, ${localStorage.user}`);
    }
  }
}

$(document).ready(function() {
  $('#app').hide();
  $('#welcome_page').hide();
  logCheck();
  $('#oauth_form').submit(function() {
    onRegister();
  })
  $('#register_form').submit(function() {
    register();
  })
  $('#login_form').submit(function() {
    login();
  })
})
