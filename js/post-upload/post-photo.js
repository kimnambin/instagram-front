// 사진 업로드

document.addEventListener('DOMContentLoaded', () => {
  const select_posting = document.getElementById('photo-upload');
  let post_arr = [];

  select_posting.addEventListener('change', e => {
    const files = e.target.files;

    if (files.length > 0) {
      let filesProcessed = 0; // 처리된 파일 수

      Array.from(files).forEach(file => {
        const reader = new FileReader();

        // Blob URL 생성 (DB에 저장용)
        const blobUrl = URL.createObjectURL(file);

        // 처리 후 post_arr에 추가
        reader.onloadend = () => {
          let fileData;

          if (file.type.includes('video')) {
            // 비디오는 서버에 저장하기!!
            // const formData = new FormData();
            // formData.append('file', file);
            // fetch('/', {
            //   method: 'POST',
            //   body: formData,
            // });
          } else {
            const base64data = reader.result;
            fileData = {
              url: base64data,
              type: file.type,
            };
          }

          post_arr.push(fileData);
          localStorage.setItem('uploadedFiles', JSON.stringify(post_arr));

          filesProcessed++;
          if (filesProcessed === files.length) {
            location.href = 'write.html';
          }
        };

        if (file.type.includes('video')) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    }
  });
});
