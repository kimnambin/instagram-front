// TODO : 댓글 화질 이상함 + 스크롤 시 댓글 입력바도 스크롤 됨

async function postingData() {
  try {
    const response = await fetch('../test.json');
    const data = await response.json();
    const container = document.getElementById('posting');

    const commentModal = document.getElementById('modalContainer');
    const closeComment = document.getElementById('closeModal');

    closeComment.addEventListener('click', () => {
      commentModal.style.display = 'none';
    });

    commentModal.addEventListener('click', () => {
      commentModal.style.display = 'none';
    });

    window.onclick = event => {
      if (event.target === commentModal) {
        commentModal.style.display = 'none';
      }
    };

    // =======무한스크롤 부분===========
    const loadingbar = document.getElementById('loading');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    let page = 0;
    const totalPages = 5;

    // 무한 스크롤 호출 여부
    const onIntersect = async (entries, observer) => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) {
          console.log('무한 스크롤 실행');
          loadingbar.style.display = 'block';

          if (page < totalPages) {
            page++;

            if (data.length < 1) {
              observer.unobserve(entry.target);
              loadingbar.textContent = '더 이상 게시글이 없습니다.';
              loadingbar.style.display = 'none';
              return;
            }

            data.forEach(item => {
              // 게시글 HTML
              const postingHTML = `
                <div class="posting-container" data-post-id="${item.id}">
                    <header class="posting-header">
                        <div class="posting-header-left">
                            <img class="profile_img" id="userData_profile_img" src="${
                              item.user.profileImage
                            }" alt="사용자 프로필" />
                            <h3 id="userData_nickname">${
                              item.user.nickname
                            }</h3>
                        </div>
                        <svg aria-label="옵션 더 보기" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <title>옵션 더 보기</title>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="6" cy="12" r="1.5"></circle>
                            <circle cx="18" cy="12" r="1.5"></circle>
                        </svg>
                    </header>
                    <img id="posting_img" class="posting-main" src="${
                      item.post.image
                    }" alt="게시글 이미지" />
                    <footer class="posting-footer">
                        <header class="posting-footer-header">
                            <div class="btn-wrapper">
                                <svg class="heart_logo" aria-label="알림" class="x1lliihq x1n2onr6 x5n08af" height="24" role="img" viewBox="0 0 24 24" width="24" id="posting_liked">
                                    <title>알림</title>
                                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                </svg>
                                <svg aria-label="댓글 달기" 
                                id='modalComment'
                                class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24" id="posting_comment">
                                    <title>댓글 달기</title>
                                    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <svg aria-label="공유하기" class="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                    <title>공유하기</title>
                                    <line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                    <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon>
                                </svg>
                            </div>
                            <svg aria-label="저장" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                <title>저장</title>
                                <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
                            </svg>
                        </header>
                        <div class="posting_footer-mid">
                            <span>
                                <h3 id="userData_nickname">${
                                  item.user.nickname
                                }</h3>
                                <h4 id="posting_title">${item.post.title}</h4>
                            </span>
                        </div>
                        <p class="posting-footer-mid" id="posting_timestamp">${new Date(
                          item.post.timestamp,
                        ).toLocaleString()}</p>
                    </footer>
                </div>
              `;

              const postElement = document.createElement('div');
              postElement.innerHTML = postingHTML;
              container.appendChild(postElement);

              // =============== 댓글 부분 =========================

              const modalComment = postElement.querySelector('#modalComment');

              modalComment.addEventListener('click', async e => {
                const postElement =
                  e.currentTarget.closest('.posting-container');
                const postingId = postElement.getAttribute('data-post-id');

                console.log('폿팅 아이디', postingId);

                const res = await fetch('../comment.json');
                const commentData = await res.json();

                commentModal.innerHTML = '';
                commentModal.style.display = 'flex';

                const showData = commentData.filter(
                  v => v.postId === Number(postingId),
                );

                const headerHTML = `
                      <header class="modal-header" id="closeModal">
          <div class="modal-underbar"></div>
          <h3>댓글</h3>
        </header>`;

                const footerHtml = `
        <footer class="modal-footer">
          <img class="profile_img" id="userData_profile_img" alt="사용자 프로필" />
          <input placeholder="댓글 입력하기..." />
          <svg
            aria-label="공유하기"
            class="x1lliihq x1n2onr6 xyb1xck"
            fill="currentColor"
            height="30"
            role="img"
            viewBox="0 0 24 24"
            width="30">
            <title>공유하기</title>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              x1="22"
              x2="9.218"
              y1="3"
              y2="10.083"></line>
            <polygon
              fill="none"
              points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"></polygon>
          </svg>
        </footer>
      `;

                const headerElement = document.createElement('div');
                headerElement.innerHTML = headerHTML;
                commentModal.appendChild(headerElement);

                if (showData.length === 0) {
                  const noCommentHTML = `
                    <div class="no-comments">
                      <h2>아직 댓글이 없습니다</h2>
                      <p>댓글을 남겨보세요</p>
                    </div>
                  `;
                  const noCommentElement = document.createElement('div');
                  noCommentElement.innerHTML = noCommentHTML;
                  commentModal.appendChild(noCommentElement);

                  const footerElement = document.createElement('div');
                  footerElement.innerHTML = footerHtml;
                  commentModal.appendChild(footerElement);
                }

                showData.forEach(item => {
                  const commentHTML = `
                
                  <main class="modal-main">
                    <div class="modal-comments">
                      <img
                        class="profile_img_comment"
                        id="userData_profile_img"
                        src="${item.user.profileImage}"
                        alt="사용자 프로필" />
                      <div class="modal-comments-mid">
                        <top class="modal-comments-top">
                          <p class="comment-nickname">${item.user.nickname}</p>
                          <p class="comment-timesptamp">${new Date(
                            item.post.timestamp,
                          ).toLocaleString()}</p>
                        </top>
                        <p class="comments">${item.post.comments}</p>
                      </div>
                      <svg
                        class="heart_logo"
                        aria-label="알림"
                        class="x1lliihq x1n2onr6 x5n08af"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                        id="posting_liked">
                        <title>알림</title>
                        <path
                          d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                      </svg>
                    </div>
                  </main>
            
                          `;

                  const commentElement = document.createElement('div');
                  commentElement.innerHTML = commentHTML;
                  commentModal.appendChild(commentElement);

                  const footerElement = document.createElement('div');
                  footerElement.innerHTML = footerHtml;
                  commentModal.appendChild(footerElement);
                });
              });
            });

            loadingbar.style.display = 'none';
          } else {
            loadingbar.textContent = '더 이상 게시글이 없습니다.';
            loadingbar.style.display = 'none';
          }
        }
      });
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
