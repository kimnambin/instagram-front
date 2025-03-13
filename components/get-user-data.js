// 로그인 한 사용자 정보를 가져오는 부분

const getUser = async () => {
  const ok = localStorage.getItem('id');
  if (!ok) {
    window.localStorage.removeItem('id');

    // window.location.href = './login.html';
  } else {
    //TODO : 특정 회원 정보 불러오기
    const res = await fetch(`http://localhost:7777/getUserById/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();
    console.log(showData.userData.email);
  }
};

document.addEventListener('DOMContentLoaded', getUser);
