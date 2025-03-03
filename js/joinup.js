const email = document.getElementById('join_email');
const pw = document.getElementById('join_pw');
const name = document.getElementById('join_name');
const username = document.getElementById('join_username');

const submit = async () => {
  const join_btn = document.getElementById('join-btn');

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

submit();
