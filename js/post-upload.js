// 뒤로가기
const prePage = () => {
  location.reload();
};

// 사진 업로드

const show_image = event => {
  const fileName = [];
  //이부분은 나중에 서버와 연동해야 함
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    fileName.push('../../images/' + files[i].name);
  }

  console.log(fileName.length);

  if (fileName.length > 0) {
    let photosrc = localStorage.setItem(
      'uploadedImages',
      JSON.stringify(fileName),
    );
    console.log(files[0].name);
    // window.location.href = 'write.html';
  }
};

// 입력한 텍스트와 선택한 이미지

const upload_post = () => {
  let value = document.getElementById('write-input').value;
  const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages'));
  console.log(value);
  console.log(uploadedImages);
};
