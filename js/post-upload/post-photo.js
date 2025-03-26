document.addEventListener('DOMContentLoaded', () => {
  const select_posting = document.getElementById('photo-upload');
  let post_arr = [];

  select_posting.addEventListener('change', e => {
    const files = e.target.files;

    if (files.length > 0) {
      let filesProcessed = 0;

      Array.from(files).forEach(file => {
        const reader = new FileReader();

        // 비디오 파일인 경우 Blob URL로 처리
        if (file.type.includes('video')) {
          Array.from(files).forEach(file => {
            // 파일 데이터 객체를 생성
            let fileData = {
              type: file.type,
              // url: URL.createObjectURL(file),
              url: file.name,
            };
            post_arr.push(fileData);

            localStorage.setItem('uploadedFiles', JSON.stringify(post_arr));

            filesProcessed++;

            if (filesProcessed === files.length) {
              location.href = 'write.html';
            }
          });
        } else {
          // 이미지 파일은 Data URL 방식으로 처리
          reader.onloadend = () => {
            let fileData = {
              url: reader.result,
              type: 'image',
            };
            post_arr.push(fileData);
            localStorage.setItem('uploadedFiles', JSON.stringify(post_arr));

            filesProcessed++;
            if (filesProcessed === files.length) {
              location.href = 'write.html';
            }
          };

          reader.readAsDataURL(file);
        }
      });
    }
  });
});
