const mode = 1;

const host_local = "http://localhost:8080";
const host_remote = "https://guitar-inventory-management-latest-ymah.onrender.com";

function getHost() {
  return mode === 0 ? host_local : host_remote;
}

function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

function getToken() {
  return localStorage.getItem("token");
}

function saveToken(token) {
  localStorage.setItem("token", token);
  updateNavBar();
}

function deleteToken() {
  localStorage.removeItem("token");
  updateNavBar();
}

let config = {
  isLoggedIn: () => isLoggedIn(),
  host: () => getHost(),
  token: () => getToken(),
};

updateNavBar();

async function updateNavBar() {
  const navigation = document.getElementsByClassName("topnav")[0];
  let loginTag = navigation.children[navigation.children.length - 1];
  console.log(loginTag.innerHTML);
  if (config.isLoggedIn()) {
    loginTag.innerHTML = `<a href="#" class="top-right" onclick="logout()">Logout</a>`;
  } else {
    loginTag.innerHTML = `<a href="login.html" class="top-right">Login</a>`;
  }
}

async function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let customer = { username: username, password: password };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(getHost() + "/signin", request);
    if (response.status == 200) {
      alert("Login successful");
      const token = await response.text();
      saveToken(token);
      location.href = "index.html";
    } else {
      console.log(`response status: ${response.status}`);
      deleteToken();
      alert("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    deleteToken();
    alert("Login failed");
  }
  updateNavBar();
}

async function register() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let customer = { username: username, password: password };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(config.host() + "/signup", request);
    if (response.status == 200) {
      alert("Registration successful");
      location.href = "login.html";
    } else {
      console.log(`response status: ${response.status}`);
      alert("Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Registration failed");
  }
}

async function logout() {
  deleteToken();
}
