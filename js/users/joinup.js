const email = document.getElementById('join_email');
const pw = document.getElementById('join_pw');
const inputName = document.getElementById('join_name');
const username = document.getElementById('join_username');
const join_btn = document.getElementById('join-btn');

join_btn.disabled = true;
join_btn.style.cursor = 'not-allowed';

const handleInput = () => {
  if (
    email.value.length > 0 &&
    pw.value.length > 0 &&
    inputName.value.length > 0 &&
    username.value.length > 0
  ) {
    join_btn.disabled = false;
    join_btn.style.backgroundColor = 'rgba(0, 149, 246, 0.8)';
    join_btn.style.cursor = 'pointer';
  } else {
    join_btn.disabled = true;
    join_btn.style.backgroundColor = '#b0b0b0';
    join_btn.style.cursor = 'not-allowed';
  }
};

const submit = async () => {
  console.log(email.value);
  try {
    const req = await fetch('http://localhost:7777/joinup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: pw.value,
        name: inputName.value,
        user_name: username.value,
      }),
    });

    console.log('서버 응답 상태:', req.status);

    if (req.ok) {
      const user_data = await req.json();
      console.log(user_data);
      const msg = confirm('로그인하러 가기');
      if (msg) {
        window.location.href = 'login.html';
      }
    } else {
      const error = await req.json();
      console.error('회원가입 실패:', error.message);
    }
  } catch (error) {
    console.error('네트워크 오류:', error);
  }
};

join_btn.addEventListener('click', submit);
email.addEventListener('input', handleInput);
pw.addEventListener('input', handleInput);
inputName.addEventListener('input', handleInput);
username.addEventListener('input', handleInput);
