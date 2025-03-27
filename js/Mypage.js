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

document.addEventListener('DOMContentLoaded', () => {
  const followBtn = document.querySelector('.follow-btn');
  const profileEditBtn = document.querySelector('.profile-edit-btn');
  const followerCount = document.querySelector('.stats span:nth-child(2) b'); // 팔로워 수 요소

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    followBtn.style.display = 'none';
    profileEditBtn.style.display = 'inline-block';
  } else {
    followBtn.style.display = 'inline-block';
    profileEditBtn.style.display = 'none';

    let isFollowing = false;

    followBtn.addEventListener('click', () => {
      // TODO : 승우님 API 필요
      isFollowing = !isFollowing;
      followBtn.textContent = isFollowing ? '언팔로우' : '팔로우';
      followBtn.style.backgroundColor = isFollowing ? '#dbdbdb' : '#0095f6';

      // 팔로우 상태가 되면 팔로워 수 증가
      if (isFollowing) {
        let currentCount = parseInt(followerCount.textContent);
        followerCount.textContent = currentCount + 1; // 팔로워 수 증가
      } else {
        let currentCount = parseInt(followerCount.textContent);
        followerCount.textContent = currentCount - 1; // 언팔로우 상태일 경우 팔로워 수 감소
      }
    });
  }
});

// 팔로워 목록 조회
async function getFollowers() {
  const ok = localStorage.getItem('userInfo');

  const res = await fetch(
    `http://13.217.186.188:7777/follow/followers/${targetUserId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const showData = await res.json();

  return {showData, ok};
}

//팔로잉 목록 조회
async function getFollowers() {
  const ok = localStorage.getItem('userInfo');

  const res = await fetch(
    `http://13.217.186.188:7777/follow/following/${targetUserId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const showData = await res.json();

  return {showData, ok};
}

// 게시글 가져오기
async function postingData() {
  const {showData, ok} = await getUser();
  if (!showData) return;

  console.log('user Id', showData.email);
  console.log('user email', ok);

  // 프로필 정보 업데이트
  document.getElementById('username').textContent =
    showData.email || '사용자 이름';

  try {
    // 사용자 ID를 기반으로 게시물 요청
    const res = await fetch(
      `http://13.217.186.188:7777/posts?user_id=${showData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const posts = await res.json();
    console.log(posts);

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    // 해당하는 게시글 찾기!!
    const postIds = posts.map(post => post.id);

    await Promise.all(
      postIds.map(async postId => {
        const detailRes = await fetch(
          `http://13.217.186.188:7777/posts/${postId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const detailPosts = await detailRes.json();
        console.log(detailPosts);

        detailPosts.contents.forEach(v => {
          const postElement = document.createElement('a');
          postElement.href = ``; // 나중에 페이지네이션용
          const imageUrl = v.url;
          postElement.innerHTML = `<img src="${imageUrl}" alt="이미지" class="post-img" />`;
          postsContainer.appendChild(postElement);
        });
      }),
    );
  } catch (e) {
    console.error(e);
  }
}
window.onload = postingData;
