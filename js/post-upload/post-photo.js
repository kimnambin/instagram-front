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
              name: file.name, // 파일 이름
              type: file.type, // 파일 타입
              size: file.size, // 파일 크기
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

//   let storedItem = localStorage.getItem('uploadedFiles');
//   if (storedItem) {
//     try {
//       let parsedData = JSON.parse(storedItem);
//       console.log('로컬스토리지에서 가져온 데이터:', parsedData);

//       if (
//         Array.isArray(parsedData) &&
//         parsedData.length > 0 &&
//         parsedData[0].data
//       ) {
//         uploadedFiles = parsedData[0].data;
//       } else {
//         console.error('데이터 구조가 예상과 다름:', parsedData);
//         uploadedFiles = [];
//       }
//     } catch (error) {
//       console.error('JSON 파싱 오류:', error);
//       uploadedFiles = [];
//     }
//   }
// });
