// 로그인 한 사용자 정보를 가져오는 부분

// TODO : 로그인한 사용자 정보 가져오는 로직 추가
export default async function getUser() {
  const ok = localStorage.getItem('userInfo');
  if (!ok) {
    window.localStorage.removeItem('userInfo');
    console.log(ok);
    // window.location.href = './login.html';
  } else {
    const res = await fetch(`http://13.217.186.188:7777/user/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();
    console.log(showData.username);
  }
}

document.addEventListener('DOMContentLoaded', getUser);

module.exports = getUser;
