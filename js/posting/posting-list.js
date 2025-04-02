export default async function createPostingHTML(item) {
  async function postData() {
    try {
      const req = await fetch(`http://13.217.186.188:7777/posts/${item.id}`, {
        method: 'GET',
      });

      if (!req.ok) {
        throw new Error('게시글 조회 실패');
      }

      const data = await req.json();
      const images = data.contents.map(v => v.url);

      const likeAPI = await fetch(
        `http://13.217.186.188:7777/likes/${item.id}`,
        {
          method: 'GET',
        },
      );

      if (!likeAPI.ok) {
        throw new Error('좋아요 조회 실패');
      }

      const likeCountData = await likeAPI.json();
      const likeCount = likeCountData.like_count;

      return {images, likeCount};
    } catch (e) {
      console.error('Error in postData:', e);
      return null;
    }
  }

  const result = await postData();

  if (result) {
    const {images, likeCount} = result;

    const postingHTML = ` 
      <div class="posting-container" data-post-id="${
        item.id
      }" style="max-width:580px">
        <header class="posting-header">
          <div class="posting-header-left">
            <img class="profile_img" src="https://www.studiopeople.kr/common/img/default_profile.png" alt="사용자 프로필" id='profile'/>
            <h3>${item.user_id}</h3>
          </div>
          <svg aria-label="옵션 더 보기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" id='post_put'>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </header>

        <div class="slide slide_wrap">
          ${images
            .map(
              url => `
            <div class="slide_item" style="background-image: url(${url}); background-size: cover; background-position: center; width: 100%; aspect-ratio: 4 / 5;"></div>`,
            )
            .join('')}
          <div class="slide_prev_button slide_button">◀</div>
          <div class="slide_next_button slide_button">▶</div>
        </div>

        <ul class="slide_pagination">
          ${images
            .map(
              (_, index) => `
            <li class="${index === 0 ? 'active' : ''}">•</li>`,
            )
            .join('')}
        </ul>

           <footer class="posting-footer">
        <header class="posting-footer-header">
          <div class="btn-wrapper">
            <svg id='heart_logo' aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
             
            </svg>
            <p id='like_cnt' class='like_cnt'>${likeCount}</p>
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
            <h3>${item.user_id}</h3>
            <h4>${item.body}</h4>
          </span>
        </div>
        <p class="posting-footer-mid">${new Date(
          item.created_at,
        ).toLocaleString()}</p>
        </footer>
      </div>
    `;

    return postingHTML;
  }
}
