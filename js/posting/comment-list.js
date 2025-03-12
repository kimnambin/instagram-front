export default async function showComments(event) {
  const postElement = event.currentTarget.closest('.posting-container');
  const postingId = postElement.getAttribute('data-post-id');
  const commentModal = document.getElementById('modalContainer');

  const res = await fetch('../comment.json');
  const commentData = await res.json();
  commentModal.innerHTML = '';
  commentModal.style.display = 'flex';

  const showData = commentData.filter(v => v.postId === Number(postingId));
  const headerHTML = `<header class="modal-header-comment" id="closeModal"><div class="modal-underbar"></div><h3>댓글</h3></header>`;
  const footerHtml = `<footer class="modal-footer"><img class="profile_img" alt="사용자 프로필" /><input placeholder="댓글 입력하기..." /><svg aria-label="공유하기" fill="currentColor" height="30" viewBox="0 0 24 24" width="30"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg></footer>`;

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
      .sort((a, b) => new Date(b.post.timestamp) - new Date(a.post.timestamp))
      .forEach(item => {
        const commentHTML = createCommentHTML(item);
        const commentElement = document.createElement('div');
        commentElement.innerHTML = commentHTML;
        commentModal.appendChild(commentElement);
      });

    function createCommentHTML(item) {
      return `
      <main class="modal-main">
        <div class="modal-comments">
          <img class="profile_img_comment" src="${
            item.user.profileImage
          }" alt="사용자 프로필" />
          <div class="modal-comments-mid">
            <top class="modal-comments-top">
              <p class="comment-nickname">${item.user.nickname}</p>
              <p class="comment-timesptamp">${new Date(
                item.post.timestamp,
              ).toLocaleString()}</p>
            </top>
            <p class="comments">${item.post.comments}</p>
          </div>
        </div>
      </main>
      `;
    }
  }

  const footerElement = document.createElement('div');
  footerElement.innerHTML = footerHtml;
  commentModal.appendChild(footerElement);
}
