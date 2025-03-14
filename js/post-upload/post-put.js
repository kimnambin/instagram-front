// 뒤로가기
const prePage = () => {
  location.reload();
};

document.addEventListener('DOMContentLoaded', async () => {
  // TODO: post_id ID 받아오기 (로컬에서 받아와도 좋을 듯)
  const req = await fetch(`http://localhost:7777/posts/${post_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (req.ok) {
    const user_data = await req.json();
    console.log('서버에서 받은 데이터:', user_data);

    const slide = document.querySelector('.slide');
    const prevBtn = document.querySelector('.slide_prev_button');
    const nextBtn = document.querySelector('.slide_next_button');
    const pagination = document.querySelector('.slide_pagination');

    const uploadedFiles = user_data.uploadedFiles;

    uploadedFiles.forEach(v => {
      if (v.type.includes('video')) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result; // Base64 데이터
          const videoElement = document.createElement('video');
          videoElement.src = base64data;
          videoElement.controls = true;
          videoElement.style.width = '100%';
          slide.appendChild(videoElement);
        };

        fetch(v.url)
          .then(response => response.blob())
          .then(blob => {
            reader.readAsDataURL(blob);
          });
      } else {
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide_item');
        slideItem.style.backgroundImage = `url(${v.url})`;
        slideItem.style.backgroundSize = 'cover';
        slideItem.style.backgroundPosition = 'center';
        slideItem.style.width = '100%';
        slide.appendChild(slideItem);
      }
    });

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
      const slideItems = document.querySelectorAll('.slide_item');
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
      currSlide = (currSlide - 1 + uploadedFiles.length) % uploadedFiles.length;
      updateSlidePosition();
    }

    nextBtn.addEventListener('click', nextMove);
    prevBtn.addEventListener('click', prevMove);

    const paginationItems = document.querySelectorAll('.slide_pagination > li');
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
  } else {
    alert('데이터를 불러오는 데 실패했습니다.');
  }
});

// 업로드 포스트 기능
document
  .getElementById('write-submit-btn')
  .addEventListener('click', async e => {
    e.preventDefault();
    const msg = confirm('정말로 업로드 하시겠습니까?');
    if (msg) {
      // TODO: 실제 포스트 ID로 대체
      const value = document.getElementById('write-input').value;
      console.log('작성한 내용:', value);

      try {
        const req = await fetch(`http://localhost:7777/posts/${post_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id,
            body: value,
          }),
        });

        if (req.ok) {
          const user_data = await req.json();
          console.log('서버에서 받은 데이터:', user_data);

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
