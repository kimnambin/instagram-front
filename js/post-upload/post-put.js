// 뒤로가기
const prePage = () => {
  location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
  const getpostId = localStorage.getItem('post-put');

  console.log(getpostId);
  //TODO : method 연동하기 where id = getpostId

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
});

const upload_post = () => {
  const value = document.getElementById('write-input').value;
  console.log('작성한 내용:', value);
  console.log('선택한 이미지:', imageName);

  //POST 메소드
};

document.getElementById('write-submit-btn').addEventListener('click', e => {
  e.preventDefault();
  const msg = confirm('정말로 업로드 하시겠습니까?');
  if (msg) {
    console.log(msg);
    window.location.href = '../main-page.html';
  }
});
