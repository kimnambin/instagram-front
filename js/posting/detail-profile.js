import {getUser} from '../component/get-user-id.js';

async function fetchData(url, errorMessage) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  if (!res.ok) throw new Error(errorMessage);
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

  // 팔로우 확인용용
  let isFollowing = followCnt.following.some(v => v.id === user_id);
  console.log(isFollowing);

  function updateButtonUI() {
    followBtn.textContent = isFollowing ? '팔로우' : '언팔로우';
    followBtn.style.backgroundColor = isFollowing ? '#0095f6' : '#dbdbdb';
  }

  updateButtonUI();

  // TODO : 언팔로우가 안됨
  followBtn.addEventListener('click', async () => {
    try {
      const method = isFollowing ? 'POST' : 'DELETE';

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
      console.log(followResponse);

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
  console.log(getFollows(user_id));
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
    document.getElementById('postCnt').textContent = posts.length || '0';

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
        }
      });

    const followBtn = document.querySelector('.follow-btn');
    updateFollowButton(user_id, followBtn, followCnt);
  } catch (e) {
    console.error('게시물 가져오기 오류:', e);
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
