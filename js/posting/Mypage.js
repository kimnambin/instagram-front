import {getUser} from '../component/get-user-id.js';
import createPostingHTML from './posting-list.js';
import showComments from './comment-list.js';
import showLikes from './likes-list.js';

async function mypageData() {
  const {showData} = await getUser();

  if (!showData) return;

  async function getFollowers() {
    try {
      const res = await fetch(
        `http://13.217.186.188:7777/follow/followers/${showData.id}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const followerCNT = await res.json();

      return followerCNT.length === 0 ? 0 : followerCNT;
    } catch (e) {
      console.error('팔로워 목록 불러오기 실패:', e);
      return 0;
    }
  }

  async function getFollows() {
    try {
      const res = await fetch(
        `http://13.217.186.188:7777/follow/following/${showData.id}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const followCNT = await res.json();
      return followCNT.length === 0 ? 0 : followCNT;
    } catch (e) {
      console.error('팔로잉 목록 불러오기 실패:', e);
      return 0;
    }
  }

  const container = document.getElementById('posting');

  async function postingData() {
    try {
      const followerCnt = await getFollowers();
      const followCnt = await getFollows();

      document.getElementById('username').textContent =
        showData.email || '사용자 이름';
      document.getElementById('Followers').textContent =
        followerCnt.followers.length || 0;
      document.getElementById('Follow').textContent =
        followCnt.following.length || 0;

      const res = await fetch(
        `http://13.217.186.188:7777/posts?user_id=${showData.id}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const posts = await res.json();

      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = '';

      const detailPost = document.getElementById('detail-posts-container');

      const postIds = posts.map(post => post.id);

      await Promise.all(
        postIds
          .sort((a, b) => b - a)
          .map(async postId => {
            try {
              const detailRes = await fetch(
                `http://13.217.186.188:7777/posts/${postId}`,
                {
                  method: 'GET',
                  headers: {'Content-Type': 'application/json'},
                },
              );
              const detailPosts = await detailRes.json();

              document.getElementById('postCnt').textContent =
                postIds.length || '0';

              const postElement = document.createElement('div');
              const imageUrl = detailPosts.contents[0].url;
              postElement.innerHTML = `<img src="${imageUrl}" alt="이미지" class="post-img" />`;
              postsContainer.appendChild(postElement);

              let isModalOpen = false;
              let currentPostElement;

              postElement.addEventListener('click', async () => {
                if (isModalOpen) {
                  currentPostElement.remove();
                  isModalOpen = false;
                  return;
                }

                const postingHTML = await createPostingHTML(detailPosts.post);
                currentPostElement = document.createElement('div');
                currentPostElement.innerHTML = postingHTML;
                container.appendChild(currentPostElement);
                isModalOpen = true;

                setupSlideFunctionality(currentPostElement);

                const modalComment =
                  currentPostElement.querySelector('#modalComment');
                modalComment.addEventListener('click', async e => {
                  await showComments(e, postId, showData?.email);
                });

                setupLikeFunctionality(currentPostElement, postId);
              });
            } catch (e) {
              console.error(`게시글 ${postId} 불러오기 실패:`, e);
            }
          }),
      );
    } catch (e) {
      console.error('게시글 불러오기 실패:', e);
    }
  }

  function setupSlideFunctionality(currentPostElement) {
    const slidePrevButton =
      currentPostElement.querySelector('.slide_prev_button');
    const slideNextButton =
      currentPostElement.querySelector('.slide_next_button');
    const slideItems = currentPostElement.querySelectorAll('.slide_item');
    const pagination = currentPostElement.querySelector('.slide_pagination');

    let currSlide = 0;

    function updateSlidePosition() {
      const offset = -currSlide * 100;
      slideItems.forEach(i => {
        i.style.transform = `translateX(${offset}%)`;
      });
      const paginationItems = pagination.querySelectorAll('li');
      paginationItems.forEach(i => i.classList.remove('active'));
      paginationItems[currSlide].classList.add('active');
    }

    function nextMove() {
      currSlide = (currSlide + 1) % slideItems.length;
      updateSlidePosition();
    }

    function prevMove() {
      currSlide = (currSlide - 1 + slideItems.length) % slideItems.length;
      updateSlidePosition();
    }

    slidePrevButton.addEventListener('click', prevMove);
    slideNextButton.addEventListener('click', nextMove);
  }

  async function setupLikeFunctionality(currentPostElement, postId) {
    try {
      const req = await fetch(`http://13.217.186.188:7777/likes/${postId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });

      const likeList = await req.json();
      let isLiked = likeList.user_ids.includes(showData.id);

      const modalLikes = currentPostElement.querySelector('#heart_logo');

      const likeCnt = currentPostElement.querySelector('#like_cnt');

      updateLikeIcon(isLiked, modalLikes);

      likeCnt.addEventListener('click', async e => {
        await showLikes(e, postId, showData?.email);
      });

      console.log(postId);
      modalLikes.addEventListener('click', async () => {
        try {
          const req = await fetch(
            `http://13.217.186.188:7777/likes/${postId}`,
            {
              method: isLiked ? 'DELETE' : 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({user_id: showData?.id}),
            },
          );

          if (req.ok) {
            isLiked = !isLiked;
            updateLikeIcon(isLiked);

            const newCount = parseInt(likeCnt.textContent) + (isLiked ? 1 : -1);
            likeCnt.textContent = Math.max(newCount, 0);
          } else {
            alert('좋아요 처리에 실패했습니다.');
          }
        } catch (error) {
          console.error('좋아요 처리 중 오류 발생:', error);
        }
      });
    } catch (error) {
      console.error('좋아요 목록 가져오기 실패:', error);
    }
  }

  function updateLikeIcon(isLiked, modalLikes) {
    if (isLiked) {
      modalLikes.innerHTML = `
  <svg aria-label="좋아요" fill="red" height="24" viewBox="0 0 24 24" width="24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
  </svg>
  `;
    } else {
      modalLikes.innerHTML = `
  <svg id="heart_logo" aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                </svg>`;
    }
  }

  await postingData();
}

window.onload = mypageData;
