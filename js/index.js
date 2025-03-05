// //로그인 상태 확인하여 화면 이동

const checkLogin = () => {
  const ok = localStorage.getItem('id');
  console.log(ok);
  if (!ok) {
    //임시로 회원가입 페이지
    window.location.href = './pages/join-page.html';
  } else {
    window.location.href = './pages/main-page.html';
  }
};

document.addEventListener('DOMContentLoaded', checkLogin);
