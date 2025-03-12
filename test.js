export default function createPostingHTML(item) {
  const htmlString = `
    <div class="posting-container" data-post-id="${
      item.id
    }" style="max-width:580px">
      <header class="posting-header">
        <div class="posting-header-left">
          <img class="profile_img" src="${
            item.user.profileImage
          }" alt="사용자 프로필" />
          <h3>${item.user.nickname}</h3>
        </div>
        <svg aria-label="옵션 더 보기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </header>

      <div class="slide slide_wrap">
        <div class="slide_prev_button slide_button">◀</div>
        <div class="slide_next_button slide_button">▶</div>
      </div>
      <ul class="slide_pagination">
        <li>•</li>
      </ul>
      <footer class="posting-footer">
        <header class="posting-footer-header">
          <div class="btn-wrapper">
            <svg id='heart_logo' aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
              <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
            </svg>
            <p id='like_cnt' class='like_cnt'> </p>
            <svg id='modalComment' aria-label="댓글 달기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
              <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
            <svg aria-label="공유하기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
              <line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
              <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon>
            </svg>
          </div>
          <svg aria-label="저장" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
          </svg>
        </header>
        <div class="posting_footer-mid">
          <span>
            <h3>${item.user.nickname}</h3>
            <h4>${item.post.title}</h4>
          </span>
        </div>
        <p class="posting-footer-mid">${new Date(
          item.post.timestamp,
        ).toLocaleString()}</p>
      </footer>
    </div>
  `;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  const slide = tempDiv.querySelector('.slide');
  const prevBtn = tempDiv.querySelector('.slide_prev_button');
  const nextBtn = tempDiv.querySelector('.slide_next_button');
  const pagination = tempDiv.querySelector('.slide_pagination');

  slide.querySelectorAll('.slide_item').forEach(item => item.remove());
  pagination.innerHTML = '';

  // 슬라이드 이미지 추가
  item.post.images.forEach(v => {
    const postingImg = document.createElement('div');
    postingImg.classList.add('slide_item');
    postingImg.style.backgroundImage = `url(${v})`;
    postingImg.style.backgroundSize = 'cover';
    postingImg.style.backgroundPosition = 'center';
    postingImg.style.width = '100%';
    slide.appendChild(postingImg);
  });

  let currSlide = 0;

  // 페이지네이션
  item.post.images.forEach((_, index) => {
    const li = document.createElement('li');
    li.textContent = '•';
    if (index === 0) li.classList.add('active');
    pagination.appendChild(li);
  });

  function updateSlidePosition() {
    const offset = -currSlide * 100;
    const slideItems = slide.querySelectorAll('.slide_item');
    slideItems.forEach(i => {
      i.style.transform = `translateX(${offset}%)`;
    });

    const paginationItems = pagination.querySelectorAll('li');
    paginationItems.forEach(i => i.classList.remove('active'));
    paginationItems[currSlide].classList.add('active');
  }

  function nextMove() {
    currSlide = (currSlide + 1) % item.post.images.length;
    updateSlidePosition();
  }

  function prevMove() {
    currSlide =
      (currSlide - 1 + item.post.images.length) % item.post.images.length;
    updateSlidePosition();
  }

  nextBtn.addEventListener('click', nextMove);
  prevBtn.addEventListener('click', prevMove);

  const paginationItems = pagination.querySelectorAll('li');
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

  // document.body.appendChild(tempDiv);

  return tempDiv.innerHTML;
}
