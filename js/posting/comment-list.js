export default async function showComments(event, post_id) {
  const postElement = event.currentTarget.closest('.posting-container');
  const postingId = postElement.getAttribute('data-post-id');
  const commentModal = document.getElementById('modalContainer');

  // 게시글에 있는 댓글 가져오기
  try {
    const res = await fetch(`http://13.217.186.188:7777/comments/${post_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const commentData = await res.json();
      commentModal.innerHTML = '';
      commentModal.style.display = 'flex';

      const showData = commentData.filter(v => v.postId === Number(postingId));
      const headerHTML = `
        <header class="modal-header-comment" id="closeModal">
          <div class="modal-underbar"></div>
          <h3>댓글</h3>
        </header>`;
      const footerHtml = `
        <footer class="modal-footer">
          <img class="profile_img" alt="사용자 프로필" />
          <input placeholder="댓글 입력하기..." id="comment_input"/>
          <button id="add_comment_button">
            <svg aria-label="공유하기" fill="currentColor" height="30" viewBox="0 0 24 24" width="30">
              <line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
              <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon>
            </svg>
          </button>
        </footer>`;

      const headerElement = document.createElement('div');
      headerElement.innerHTML = headerHTML;
      commentModal.appendChild(headerElement);

      const closeModal = document.getElementById('closeModal');
      closeModal.addEventListener('click', () => {
        commentModal.style.display = 'none';
      });

      if (showData.length === 0) {
        const noCommentHTML = `<div class="no-comments"><h2>아직 댓글이 없습니다</h2><p>댓글을 남겨보세요</p></div>`;
        const noCommentElement = document.createElement('div');
        noCommentElement.innerHTML = noCommentHTML;
        commentModal.appendChild(noCommentElement);
      } else {
        showData
          .sort(
            (a, b) => new Date(b.post.timestamp) - new Date(a.post.timestamp),
          )
          .forEach(item => {
            const commentHTML = createCommentHTML(item);
            const commentElement = document.createElement('div');
            commentElement.innerHTML = commentHTML;
            commentModal.appendChild(commentElement);
          });
      }

      const footerElement = document.createElement('div');
      footerElement.innerHTML = footerHtml;
      commentModal.appendChild(footerElement);

      const comment_input = document.getElementById('comment_input');

      async function add_comment() {
        try {
          const req = await fetch(`http://localhost:7777/comments/${post_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id,
              body: comment_input.value,
            }),
          });

          if (req.ok) {
            const user_data = await req.json();
            console.log('서버에서 받은 데이터:', user_data);
            // 댓글 추가 후 UI 업데이트
            const commentHTML = createCommentHTML(user_data);
            const commentElement = document.createElement('div');
            commentElement.innerHTML = commentHTML;
            commentModal.appendChild(commentElement);
            comment_input.value = '';
          } else {
            alert('업로드에 실패했습니다');
          }
        } catch (error) {
          console.error('에러 발생:', error);
          alert('업로드 중 오류가 발생했습니다');
        }
      }

      const addCommentButton = document.getElementById('add_comment_button');
      addCommentButton.addEventListener('click', add_comment);
    } else {
      alert('포스팅을 가져오는 데 실패했습니다');
    }

    function createCommentHTML(item) {
      return `
        <main class="modal-main">
          <div class="modal-comments">
            <img class="profile_img_comment" src="${
              item.user.profileImage
            }" alt="사용자 프로필" />
            <div class="modal-comments-mid">
              <div class="modal-comments-top">
                <p class="comment-nickname">${item.user.nickname}</p>
                <p class="comment-timestamp">${new Date(
                  item.post.timestamp,
                ).toLocaleString()}</p>
              </div>
              <p class="comments">${item.post.comments}</p>
            </div>
          </div>
        </main>
      `;
    }
  } catch (e) {
    console.log(e);
  }
}
