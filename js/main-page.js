const getUser = async () => {
  const ok = localStorage.getItem('id');  
  if (!ok) {  
    window.localStorage.removeItem('id');  
    window.location.href = '../pages/main-page.html';  
  } else {
    
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