// Toggle Login / Sign Up Tabs
function showTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginBtn = document.querySelector(".tab-btn:nth-child(1)");
  const signupBtn = document.querySelector(".tab-btn:nth-child(2)");

  if(tab === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
  }
}

// --- LOGIN ---
document.getElementById("loginForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(!role || !username || !password) { 
    alert("Please fill all fields"); 
    return; 
  }

  try{
    const res = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if(res.ok){
      if(data.role !== role){
        alert(`Role mismatch! You selected ${role} but your account is ${data.role}`);
        return;
      }
      alert("Login successful ✅");
      // Redirect based on role
      if(role === "admin") window.location.href = "admin-dashboard.html";
      else if(role === "volunteer") window.location.href = "volunteer-dashboard.html";
      else window.location.href = "ngo-dashboard.html";
    } else {
      alert(data.detail || "Login failed ❌");
    }

  } catch(err){
    console.error(err);
    alert("Login error ❌");
  }
});

// --- SIGN UP ---
document.getElementById("signupForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const role = document.getElementById("signupRole").value;
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if(!role || !username || !password || !confirm){
    alert("Please fill all fields");
    return;
  }

  if(password !== confirm){
    alert("Passwords do not match ❌");
    return;
  }

  try{
    const res = await fetch("http://127.0.0.1:8000/auth/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password, role})
    });

    const data = await res.json();

    if(res.ok){
      alert("Sign Up successful! You can now login ✅");
      showTab('login'); // switch to login tab
    } else {
      alert(data.detail || "Sign Up failed ❌");
    }

  } catch(err){
    console.error(err);
    alert("Sign Up error ❌");
  }
});