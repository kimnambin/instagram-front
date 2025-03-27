// TODO : 게시글 수정 + 포스팅이 비디오일 경우

import createPostingHTML from './posting-list.js';
import showComments from './comment-list.js';
import showLikes from './likes-list.js';

async function getUser() {
  const ok = localStorage.getItem('userInfo');
  if (!ok) {
    window.localStorage.removeItem('userInfo');
    console.log(ok);
    window.location.href = './login.html';
  } else {
    const res = await fetch(`http://13.217.186.188:7777/user/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();

    return {showData, ok};
  }
}

document.addEventListener('DOMContentLoaded', getUser);

async function postingData() {
  const {showData, ok} = await getUser();
  console.log('user Id', showData?.id);
  console.log('user email', ok);
  try {
    const res = await fetch(
      // `http://13.217.186.188:7777/posts/followedposts?user_id=${userData.id}`,
      `http://13.217.186.188:7777/posts/all`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    console.log('서버에서 받은 데이터:', data);

    const container = document.getElementById('posting');
    const commentModal = document.getElementById('modalContainer');
    const likesModal = document.getElementById('likes_modalContainer');
    const closeComment = document.getElementById('close');
    const loadingbar = document.getElementById('loading');
    const totalPages = data.length;
    let page = 0;

    closeComment.addEventListener('click', () => {
      commentModal.style.display = 'none';
      likesModal.style.display = 'none';
    });
    // TODO : 무한 스크롤 오류 (동일한 게 2번씩 나타남)
    // 무한 스크롤 설정
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const onIntersect = async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          loadingbar.style.display = 'block';

          if (page < totalPages) {
            page++;
            if (page > totalPages) {
              observer.unobserve(entry.target);
              loadingbar.textContent = '더 이상 게시글이 없습니다.';
              loadingbar.style.display = 'none';
              return;
            }

            data
              .sort((a, b) => b.id - a.id)
              .forEach(async item => {
                const postingHTML = await createPostingHTML(item);

                const postElement = document.createElement('div');
                postElement.innerHTML = postingHTML;
                container.appendChild(postElement);

                const slidePrevButton =
                  container.querySelector('.slide_prev_button');
                const slideNextButton =
                  container.querySelector('.slide_next_button');

                slidePrevButton.addEventListener('click', () => {
                  console.log('이전 버튼 클릭');
                  prevMove();
                });

                slideNextButton.addEventListener('click', () => {
                  console.log('다음 버튼 클릭');
                  nextMove();
                });

                // 슬라이드 관련 코드 (sliders, pagination 등)
                const slideItems = container.querySelectorAll('.slide_item');
                const pagination = container.querySelector('.slide_pagination');
                let currSlide = 0;

                function updateSlidePosition() {
                  const offset = -currSlide * 100;
                  slideItems.forEach(i => {
                    i.style.transform = `translateX(${offset}%)`;
                  });
                  console.log(`현재 슬라이드: ${currSlide}, 오프셋: ${offset}`);
                  const paginationItems = pagination.querySelectorAll('li');
                  paginationItems.forEach(i => i.classList.remove('active'));
                  paginationItems[currSlide].classList.add('active');
                }

                function nextMove() {
                  currSlide = (currSlide + 1) % slideItems.length;
                  updateSlidePosition();
                }

                function prevMove() {
                  currSlide =
                    (currSlide - 1 + slideItems.length) % slideItems.length;
                  updateSlidePosition();
                }

                const post_put = postElement.querySelector('#post_put');
                const post_id = item.id;
                post_put.addEventListener('click', e => {
                  const msg = confirm('게시글을 수정하시겠습니까??');
                  if (msg) {
                    localStorage.setItem('post-put-id', postingId);
                    window.location.href = './post-upload-page/post-put.html';
                  }
                });

                // 댓글 목록
                const modalComment = postElement.querySelector('#modalComment');
                modalComment.addEventListener('click', async e => {
                  await showComments(e, post_id);
                });

                // 좋아요 목록
                const modalLikes = postElement.querySelector('#heart_logo');
                const like_cnt = postElement.querySelector('#like_cnt');
                like_cnt.addEventListener('click', async e => {
                  await showLikes(e, post_id);
                });
                let like_check = false;

                // 좋아요 클릭
                modalLikes.addEventListener('click', async e => {
                  console.log('dsddddd', post_id);
                  try {
                    const req = await fetch(
                      `http://13.217.186.188:7777/likes/${post_id}`,
                      {
                        method: like_check ? 'DELETE' : 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          user_email: ok,
                        }),
                      },
                    );

                    if (req.ok) {
                      const user_data = await req.json();
                      console.log('서버에서 받은 데이터:', user_data);

                      if (!like_check) {
                        console.log('좋아요 추가');
                        like_check = true;
                        modalLikes.innerHTML = `   
          <svg aria-label="좋아요" fill="red" height="24" viewBox="0 0 24 24" width="24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        `;
                      } else {
                        console.log('좋아요 취소됨');
                        like_check = false;
                        modalLikes.innerHTML = `   
          <svg id="heart_logo" aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
          </svg>
        `;
                      }
                    } else {
                      alert('실패했습니다');
                    }
                  } catch (error) {
                    console.error('에러 발생:', error);
                  }
                });
              });

            loadingbar.style.display = 'none';
          } else {
            loadingbar.textContent = '더 이상 게시글이 없습니다.';
            loadingbar.style.display = 'none';
          }
        }
      }
    };

    const observer = new IntersectionObserver(onIntersect, options);
    const sentinel = document.createElement('div');
    container.appendChild(sentinel);
    observer.observe(sentinel);
  } catch (error) {
    console.error('에러 발생:', error);
  }

  // =======================================
}

window.onload = postingData;
