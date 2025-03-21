document
  .querySelector('.login-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault(); // 페이지 새로 고침 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const req = await fetch('http://13.217.186.188:7777/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (req.ok) {
        const user_data = await req.json();
        console.log(user_data);
        localStorage.setItem('userInfo', username);

        const msg = confirm('로그인 성공!!');
        if (msg) {
          window.location.href = 'main-page.html';
        }
      } else {
        const error = await req.json();
        console.error('회원가입 실패:', error.message);
      }
    } catch (e) {
      console.log(e);
    }
  });
