// 뒤로가기
const prePage = () => {
  location.reload();
};

// 선택한 이미지를 URL에 추가하기 위함

document.addEventListener('DOMContentLoaded', () => {
  const preview_img = document.getElementById('write-ptoto-area');
  const getImg = localStorage.getItem('uploadedImage');
  console.log('선택히ㅏㄴ이미지', getImg);
  preview_img.src = getImg;
});

const upload_post = () => {
  const value = document.getElementById('write-input').value;
  console.log('작성한 내용:', value);
  console.log('선택한 이미지:', imageName);

  //POST 메소드
};

document.getElementById('write-submit-btn').addEventListener('click', () => {
  const msg = confirm('정말로 업로드 하시겠습니까?');
  if (msg) {
    window.location.href = '../join-page.html';
  }
});
