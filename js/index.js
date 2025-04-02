const ok = localStorage.getItem('userToken');
if (!ok) {
  window.location.href = './pages/login.html';
} else {
  window.location.href = './pages/main-page.html';
}

document.addEventListener('DOMContentLoaded', checkLogin);
