const users = [];

// hashing function
function hash(password) {
  const argon2 = require('argon2');

  // hash the password using argon2
  argon2.hash(password)
    .then(hash => {
      console.log("hashed password: ", hash);
    })
    .catch(err => {
      console.error("error hashing password: ", err);
    });

  // verify the password
  argon2.verify(storedHash, password).then(match => {
    if (match) {console.log("password is valid");}
    else {console.log("Invalid password");}
  })
  .catch(err => {
    console.error("error verifying password: ", err);
  });

  return password;
}

function signup(event) {
  event.preventDefault();
  console.log("successful signup");

  // add username and password to the database (dictionary)
  users.push({ username: document.getElementById("username").value, 
              password: hash(document.getElementById("password").value) });
}

function login(event) {
  event.preventDefault();
  console.log("successful login");
}