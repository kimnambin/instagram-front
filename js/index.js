// //로그인 상태 확인하여 화면 이동
const ok = localStorage.getItem('id');
console.log(ok);
if (!ok) {
  window.location.href = './pages/login.html';
} else {
  window.location.href = './pages/main-page.html';
}

document.addEventListener('DOMContentLoaded', checkLogin);
