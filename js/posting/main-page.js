// TODO : 게시글 수정 구현해야 함

import createPostingHTML from './posting-list.js';
import showComments from './comment-list.js';
import showLikes from './likes-list.js';

async function postingData() {
  try {
    const response = await fetch('../test.json');
    const data = await response.json();
    const container = document.getElementById('posting');
    const commentModal = document.getElementById('modalContainer');
    const likesModal = document.getElementById('likes_modalContainer');
    const closeComment = document.getElementById('close');
    const loadingbar = document.getElementById('loading');
    const totalPages = 5;
    let page = 0;

    closeComment.addEventListener('click', () => {
      commentModal.style.display = 'none';
      likesModal.style.display = 'none';
    });

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
            if (data.length < 1) {
              observer.unobserve(entry.target);
              loadingbar.textContent = '더 이상 게시글이 없습니다.';
              loadingbar.style.display = 'none';
              return;
            }

            data
              .sort((a, b) => b.id - a.id)
              .forEach(item => {
                const postingHTML = createPostingHTML(item);
                const postElement = document.createElement('div');
                postElement.innerHTML = postingHTML;
                container.appendChild(postElement);

                // 댓글 목록
                const modalComment = postElement.querySelector('#modalComment');
                modalComment.addEventListener('click', async e => {
                  await showComments(e);
                });

                // 좋아요 목록
                const modalLikes = postElement.querySelector('#heart_logo');
                const like_cnt = postElement.querySelector('#like_cnt');
                let like_check = false;
                modalLikes.addEventListener('click', async e => {
                  // TODO : 좋아요 post 메소드 추가
                  let cnt = 1;
                  if (!like_check) {
                    like_check = true;
                    console.log('좋아요 클릭됨');
                    modalLikes.innerHTML = `   
                      <svg aria-label="좋아요" fill="red" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                        </svg>
                      `;
                    like_cnt.innerHTML = `
                      ${cnt}
                      `;
                    like_cnt.addEventListener('click', async e => {
                      await showLikes(e);
                    });
                  } else {
                    console.log('좋아요 취소됨');
                    like_check = false;
                    modalLikes.innerHTML = `   
                      <svg id="heart_logo" aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                      </svg>`;

                    like_cnt.innerHTML = ` `;
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
    console.error('fetch error', error);
  }
}

window.onload = postingData;
