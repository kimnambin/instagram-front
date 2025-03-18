// 로그인 한 사용자 정보를 가져오는 부분

// TODO : 로그인한 사용자 정보 가져오는 로직 추가
export default async function getUser() {
  const ok = localStorage.getItem('id');
  if (!ok) {
    window.localStorage.removeItem('id');

    // window.location.href = './login.html';
  } else {
    const res = await fetch(`http://localhost:7777/getUserById/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();
    console.log(showData.userData.email);
    // TDOD : 프로필 사진도 받아오기
  }
}

document.addEventListener('DOMContentLoaded', getUser);
