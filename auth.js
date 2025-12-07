// Helper: get users array from localStorage
function getUsers() {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
}

// Helper: save users array
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// REGISTER LOGIC
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const users = getUsers();
    const exists = users.some((u) => u.username === username);
    if (exists) {
      alert("Username already exists. Choose another.");
      return;
    }

    users.push({ username, email, password }); // plain text only for practice
    saveUsers(users);

    alert("Account created! You can now log in.");
    window.location.href = "login.html";
  });
}

// LOGIN LOGIC
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    // Save current user and go to HOME
    localStorage.setItem("currentUser", username);
    window.location.href = "home.html";
  });
}
