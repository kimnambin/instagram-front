export async function getUser() {
  const currentURL = window.location.href;

  if (currentURL.includes('login')) {
    alert('다시 로그인을 해주세요');
    window.localStorage.removeItem('userInfo');
    window.localStorage.removeItem('userInfoTime');
    window.location.href = './login.html';
  } else {
    const ok = localStorage.getItem('userInfo');
    if (!ok) {
      alert('다시 로그인을 해주세요.');
      window.localStorage.removeItem('userInfo');
      window.location.href = './login.html';
    } else {
      const res = await fetch(`http://13.217.186.188:7777/user/${ok}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const showData = await res.json();

      return {showData};
    }
  }
}
