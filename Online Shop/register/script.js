function validate(event) {
  const password = document.getElementById('password').value;
  const confirmPass = document.getElementById('confirmPass').value;
  const phone = document.getElementById('phone').value;

  if (!/^\d+$/.test(phone)) {
    alert('Phone number must contain only digits!');
    event.preventDefault();
    return false;
  }
  if (phone.length !== 11) {
    alert('Phone number must be 11 digits long!');
    event.preventDefault();
    return false;
  }
  if (password !== confirmPass) {
    alert('Passwords do not match!');
    event.preventDefault();
    return false;
  }
  if( password.length < 6) {
    alert('Password must be at least 6 characters long!');
    event.preventDefault();
    return false;
  }
  return true;
}



