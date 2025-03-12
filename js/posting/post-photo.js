// 사진 업로드

document.addEventListener('DOMContentLoaded', () => {
  const select_photo = document.getElementById('photo-upload');

  select_photo.addEventListener('change', e => {
    const imgPath = e.target.files[0];

    if (imgPath) {
      const reader = new FileReader();

      reader.onload = () => {
        localStorage.setItem('uploadedImage', reader.result);
        location.href = `write.html`;
      };
      reader.readAsDataURL(imgPath);
    }
  });
});
