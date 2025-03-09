const email = document.getElementById('join_email');
const pw = document.getElementById('join_pw');
const name = document.getElementById('join_name');
const username = document.getElementById('join_username');
const join_btn = document.getElementById('join-btn');

join_btn.disabled = true;
join_btn.style.cursor = 'not-allowed';

const handleInput = () => {
  if (
    email.value.length > 0 &&
    pw.value.length > 0 &&
    name.value.length > 0 &&
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
  join_btn.addEventListener('click', async () => {
    const req = await fetch('http://localhost:7777/joinup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: pw.value,
        name: name.value,
        user_name: username.value,
      }),
    });

    if (req.ok) {
      const user_data = await req.json();
      console.log(user_data);
    } else {
      const error = await req.json();
      console.error('회원가입 실패:', error.message);
    }
  });
};

email.addEventListener('input', handleInput);
pw.addEventListener('input', handleInput);
name.addEventListener('input', handleInput);
username.addEventListener('input', handleInput);

submit();
