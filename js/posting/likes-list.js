export default async function showLikes(e, post_id) {
  const likes_modalContainer = document.getElementById('likes_modalContainer');
  const postElement = e.currentTarget.closest('.posting-container');
  const postingId = postElement.getAttribute('data-post-id');

  // TODO : 게시글 당 전체 좋아요 가져오는 로직
  try {
    const res = await fetch(`http://13.217.186.188:7777/likes/${post_id}`);
    const likesData = await res.json();
    likes_modalContainer.innerHTML = '';
    likes_modalContainer.style.display = 'flex';

    const showData = likesData.filter(v => v.postId === Number(postingId));

    const headerHTML = `
      <header class="modal-header" id="closeLikes">
        <div class="modal-underbar-likes"></div>
        <h3>좋아요</h3>
      </header>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="검색" />
        <svg aria-label="검색" role="img" viewBox="0 0 24 24">
          <title>검색</title>
          <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
        </svg>
      </div>`;

    const headerElement = document.createElement('div');
    headerElement.innerHTML = headerHTML;
    likes_modalContainer.appendChild(headerElement);

    const closeModal = document.getElementById('closeLikes');
    closeModal.addEventListener('click', () => {
      likes_modalContainer.style.display = 'none';
    });

    const searchInput = document.getElementById('searchInput');

    // 검색
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredData = showData.filter(item =>
        item.user.nickname.toLowerCase().includes(searchTerm),
      );
      updateLikesDisplay(filteredData);
    });

    // 초기 좋아요 목록 표시
    updateLikesDisplay(showData);

    function updateLikesDisplay(data) {
      const existingLikes = document.querySelectorAll('.modal-main');
      existingLikes.forEach(like => like.remove());

      if (data.length === 0) {
        const noLikeHTML = `<div class="no-comments"><h2>아직 좋아요가 없습니다</h2></div>`;
        const noLikeElement = document.createElement('div');
        noLikeElement.innerHTML = noLikeHTML;
        likes_modalContainer.appendChild(noLikeElement);
      } else {
        data
          .sort(
            (a, b) => new Date(b.post.timestamp) - new Date(a.post.timestamp),
          )
          .forEach(item => {
            const likeHTML = componentLikesHTML(item);
            const likesElement = document.createElement('div');
            likesElement.innerHTML = likeHTML;
            likes_modalContainer.appendChild(likesElement);
          });
      }
    }

    function componentLikesHTML(item) {
      return `
        <main class="modal-main">
          <div class="modal-comments">
            <div class="modal-likes">
              <img class="profile_img_comment" id="userData_profile_img" src="${item.user.profileImage}" alt="사용자 프로필" />
              <p class="likes-nickname">${item.user.nickname}</p>
            </div>
            <button class="follow-btn">팔로우</button>
          </div>
        </main>
      `;
    }
  } catch (e) {
    console.log(e);
  }
}
