import {getUser} from '../component/get-user-id.js';
import createPostingHTML from './posting-list.js';
import showComments from './comment-list.js';
import showLikes from './likes-list.js';

async function fetchData(url, Message) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  if (!res.ok) throw new Error(Message);
  return res.json();
}

async function getFollowers(user_id) {
  return fetchData(
    `http://13.217.186.188:7777/follow/followers/${user_id}`,
    '팔로워 목록 가져오기 실패',
  );
}

async function getFollows(user_id) {
  return fetchData(
    `http://13.217.186.188:7777/follow/following/${user_id}`,
    '팔로우 목록 가져오기 실패',
  );
}

async function getPosts(user_id) {
  return fetchData(
    `http://13.217.186.188:7777/posts?user_id=${user_id}`,
    '게시물 가져오기 실패',
  );
}

async function getPostDetails(postId) {
  return fetchData(
    `http://13.217.186.188:7777/posts/${postId}`,
    `게시물 내용 가져오기 실패: ${postId}`,
  );
}

async function updateFollowButton(user_id, followBtn, followCnt) {
  const userToken = localStorage.getItem('userToken');

  let isFollowing = followCnt.following.some(v => v.id === user_id);

  function updateButtonUI() {
    followBtn.textContent = isFollowing ? '언팔로우' : '팔로우';
    followBtn.style.backgroundColor = isFollowing ? '#dbdbdb' : '#0095f6';
  }

  updateButtonUI();

  followBtn.addEventListener('click', async () => {
    try {
      const method = isFollowing ? 'DELETE' : 'POST';

      const followResponse = await fetch(
        `http://13.217.186.188:7777/follow/follow/${user_id}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (!followResponse.ok) throw new Error('팔로우/언팔로우 요청 실패');

      isFollowing = !isFollowing;
      updateButtonUI();

      const followersCountEl = document.getElementById('Followers');
      const followeringCountEl = document.getElementById('Follow');
      let currentCount = parseInt(followersCountEl.textContent, 10);
      let FollowCount = parseInt(followeringCountEl.textContent, 10);
      followersCountEl.textContent = isFollowing
        ? currentCount + 1
        : Math.max(0, currentCount - 1);
      followeringCountEl.textContent = isFollowing
        ? FollowCount + 1
        : Math.max(0, FollowCount - 1);
    } catch (e) {
      console.error('팔로우/언팔로우 요청 중 오류 발생:', e);
    }
  });
}

async function postingData(user_id, showData) {
  try {
    const [followerCnt, followCnt, posts] = await Promise.all([
      getFollowers(user_id),
      getFollows(user_id),
      getPosts(user_id),
    ]);

    document.getElementById('username').textContent =
      showData.username || '사용자 이름';
    document.getElementById('Followers').textContent =
      followerCnt.followers.length || 0;
    document.getElementById('Follow').textContent =
      followCnt.following.length || 0;
    document.getElementById('postCnt').textContent = posts.length || 0;

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    const postDetails = await Promise.all(
      posts.map(post => getPostDetails(post.id)),
    );

    postDetails
      .sort((a, b) => b.id - a.id)
      .forEach(detailPosts => {
        const postElement = document.createElement('div');
        const imageUrl = detailPosts.contents[0]?.url;

        if (imageUrl) {
          postElement.innerHTML = `<img src="${imageUrl}" alt="이미지" class="post-img" />`;
          postsContainer.appendChild(postElement);

          const postId = detailPosts.post.id;
          init_postModal(postElement, detailPosts, postId);
        }
      });

    const followBtn = document.querySelector('.follow-btn');
    await updateFollowButton(user_id, followBtn, followCnt);
  } catch (e) {
    console.error('게시물 가져오기 오류:', e);
  }
}

function init_postModal(postElement, detailPosts, postId) {
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
    document.body.appendChild(currentPostElement);

    setupSlideControls(currentPostElement, postId);

    isModalOpen = true;
  });
}

function setupSlideControls(currentPostElement, postId) {
  const slideItems = currentPostElement.querySelectorAll('.slide_item');
  const pagination = currentPostElement.querySelector('.slide_pagination');
  let currSlide = 0;

  function updateSlidePosition() {
    const offset = -currSlide * 100;
    slideItems.forEach(item => {
      item.style.transform = `translateX(${offset}%)`;
    });
    const paginationItems = pagination.querySelectorAll('li');
    paginationItems.forEach(item => item.classList.remove('active'));
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

  const slidePrevButton =
    currentPostElement.querySelector('.slide_prev_button');
  const slideNextButton =
    currentPostElement.querySelector('.slide_next_button');

  slidePrevButton.addEventListener('click', () => {
    prevMove();
  });

  slideNextButton.addEventListener('click', () => {
    nextMove();
  });

  const modalComment = currentPostElement.querySelector('#modalComment');
  modalComment.addEventListener('click', async e => {
    await showComments(e, postId, showData?.email);
  });

  setupLikeFunctionality(currentPostElement, postId);
}

async function setupLikeFunctionality(currentPostElement, postId) {
  const {showData} = await getUser();
  try {
    const req = await fetch(`http://13.217.186.188:7777/likes/${postId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });

    const likeList = await req.json();
    let isLiked = likeList.user_ids.includes(showData.id);

    const modalLikes = currentPostElement.querySelector('#heart_logo');

    const likeCnt = currentPostElement.querySelector('#like_cnt');

    updateLikeIcon(modalLikes, isLiked);

    likeCnt.addEventListener('click', async e => {
      await showLikes(e, postId, showData?.email);
    });

    modalLikes.addEventListener('click', async () => {
      try {
        const req = await fetch(`http://13.217.186.188:7777/likes/${postId}`, {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: showData?.id}),
        });

        if (req.ok) {
          isLiked = !isLiked;
          updateLikeIcon(modalLikes, isLiked);

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

  function updateLikeIcon(modalLikes, isLiked) {
    modalLikes.innerHTML = isLiked
      ? ` <svg aria-label="좋아요" fill="red" height="24" viewBox="0 0 24 24" width="24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>`
      : `<svg id="heart_logo" aria-label="알림" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                              </svg>`;
  }
}

export default async function get_profile() {
  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get('user_id');
  const {showData} = await getUser();

  if (!showData) return;

  try {
    await postingData(user_id, showData);
  } catch (e) {
    console.error('프로필 가져오기 오류:', e);
  }
}

window.onload = get_profile;
