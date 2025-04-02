document.addEventListener('DOMContentLoaded', () => {
  const select_posting = document.getElementById('photo-upload');
  let post_arr = [];

  select_posting.addEventListener('change', e => {
    const files = e.target.files;

    if (files.length > 0) {
      let filesProcessed = 0;

      Array.from(files).forEach(file => {
        const reader = new FileReader();

        if (file.type.includes('video')) {
          Array.from(files).forEach(file => {
            let fileData = {
              type: file.type,
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
