document
  .querySelector('.login-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault(); // 페이지 새로 고침 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const req = await fetch('http://localhost:7777/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username.value,
        password: password.value,
      }),
    });

    if (req.ok) {
      const user_data = await req.json();
      console.log(user_data);
    } else {
      const error = await req.json();
      console.error('회원가입 실패:', error.message);
    }

    if (username && password) {
      alert('로그인 성공!');
      // window.location.href = './main-page.html';
      // 여기에 실제 로그인 처리 로직을 추가할 수 있습니다.
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  });
