function login(event) {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if(email === '' || password === '') {
    event.preventDefault();
    alert('Please fill in all fields.');
    return false;
  }
  if(email === 'admin@gmail.com' && password === 'admin') {
    event.preventDefault();
    window.location.href = '/admin/Index.html';
    return false;
  }
  event.preventDefault();
  window.location.href = '/home/Index.html';
  return false;
}