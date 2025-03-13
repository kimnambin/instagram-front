// 뒤로가기
const prePage = () => {
  location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
  const getImg = localStorage.getItem('uploadedFiles');
  const postvalue = document.getElementById('write-input');

  const slide = document.querySelector('.slide');
  const prevBtn = document.querySelector('.slide_prev_button');
  const nextBtn = document.querySelector('.slide_next_button');
  const pagination = document.querySelector('.slide_pagination');

  if (getImg) {
    const uploadedFiles = JSON.parse(getImg);

    uploadedFiles.forEach(v => {
      if (v.type.includes('video')) {
        const videoElement = document.createElement('video');
        videoElement.src = v.url;
        videoElement.controls = true;
        videoElement.style.width = '100%';
        slideItem.appendChild(videoElement);
      } else {
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide_item');
        slideItem.style.backgroundImage = `url(${v.url})`;
        slideItem.style.backgroundSize = 'cover';
        slideItem.style.backgroundPosition = 'center';
        slideItem.style.width = '100%';
        slide.appendChild(slideItem);

        let slideItems = document.querySelectorAll('.slide_item');
        let currSlide = 0;

        // 페이지네이션
        pagination.innerHTML = '';
        uploadedFiles.forEach((_, index) => {
          const li = document.createElement('li');
          li.textContent = '•';
          if (index === 0) li.classList.add('active');
          pagination.appendChild(li);
        });

        function updateSlidePosition() {
          const offset = -currSlide * 100;
          slideItems.forEach(i => {
            i.style.transform = `translateX(${offset}%)`;
          });

          const paginationItems = document.querySelectorAll(
            '.slide_pagination > li',
          );
          paginationItems.forEach(i => i.classList.remove('active'));
          paginationItems[currSlide].classList.add('active');
        }

        function nextMove() {
          currSlide = (currSlide + 1) % uploadedFiles.length;
          updateSlidePosition();
        }

        function prevMove() {
          currSlide =
            (currSlide - 1 + uploadedFiles.length) % uploadedFiles.length;
          updateSlidePosition();
        }

        nextBtn.addEventListener('click', nextMove);
        prevBtn.addEventListener('click', prevMove);

        const paginationItems = document.querySelectorAll(
          '.slide_pagination > li',
        );
        paginationItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            currSlide = index;
            updateSlidePosition();
          });
        });

        let startPoint = 0;
        slide.addEventListener('mousedown', e => {
          startPoint = e.pageX;
        });

        slide.addEventListener('mouseup', e => {
          const endPoint = e.pageX;
          if (startPoint < endPoint) {
            prevMove();
          } else if (startPoint > endPoint) {
            nextMove();
          }
        });

        updateSlidePosition();
      }
    });
  }

  document
    .getElementById('write-submit-btn')
    .addEventListener('click', async e => {
      e.preventDefault();
      const msg = confirm('정말로 업로드 하시겠습니까?');
      if (msg) {
        // TODO : 수정 필요
        const data = {
          img: getImg,
          text: postvalue.value,
        };
        console.log('작성한 내용:', postvalue.value);
        try {
          const req = await fetch('/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (req.ok) {
            const user_data = await req.json();
            console.log(user_data);
            console.log('서버에서 받은 데이터:', user_data);

            // 페이지 이동 (주석 해제 시 이동)
            // window.location.href = '../main-page.html';
          } else {
            alert('업로드에 실패했습니다');
          }
        } catch (error) {
          console.error('에러 발생:', error);
          alert('업로드 중 오류가 발생했습니다');
        }
      }
    });
});
