import {getUser} from '../component/get-user-id.js';

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
      return await res.json();
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
      return await res.json();
    } catch (e) {
      console.error('팔로잉 목록 불러오기 실패:', e);
      return 0;
    }
  }

  async function postingData() {
    const followerCnt = await getFollowers();
    const followCnt = await getFollows();

    document.getElementById('username').textContent =
      showData.email || '사용자 이름';
    document.getElementById('Followers').textContent = followerCnt || 0;
    document.getElementById('Follow').textContent = followCnt || 0;

    try {
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

              // detailPosts.contents.forEach(v => {
              const postElement = document.createElement('a');
              postElement.href = '#'; // 페이지 이동 기능 추가 가능
              const imageUrl = detailPosts.contents[0].url;
              postElement.innerHTML = `<img src="${imageUrl}" alt="이미지" class="post-img" />`;
              postsContainer.appendChild(postElement);
              // });
            } catch (e) {
              console.error(`게시글 ${postId} 불러오기 실패:`, e);
            }
          }),
      );
    } catch (e) {
      console.error('게시글 불러오기 실패:', e);
    }
  }

  await postingData();
}

window.onload = mypageData;

// document.addEventListener('DOMContentLoaded', () => {
//   const followBtn = document.querySelector('.follow-btn');
//   const profileEditBtn = document.querySelector('.profile-edit-btn');
//   const followerCount = document.querySelector('.stats span:nth-child(2) b'); // 팔로워 수 요소

//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

//   if (isLoggedIn) {
//     followBtn.style.display = 'none';
//     profileEditBtn.style.display = 'inline-block';
//   } else {
//     followBtn.style.display = 'inline-block';
//     profileEditBtn.style.display = 'none';

//     let isFollowing = false;

//     followBtn.addEventListener('click', () => {
//       // TODO : 승우님 API 필요
//       isFollowing = !isFollowing;
//       followBtn.textContent = isFollowing ? '언팔로우' : '팔로우';
//       followBtn.style.backgroundColor = isFollowing ? '#dbdbdb' : '#0095f6';

//       // 팔로우 상태가 되면 팔로워 수 증가
//       if (isFollowing) {
//         let currentCount = parseInt(followerCount.textContent);
//         followerCount.textContent = currentCount + 1; // 팔로워 수 증가
//       } else {
//         let currentCount = parseInt(followerCount.textContent);
//         followerCount.textContent = currentCount - 1; // 언팔로우 상태일 경우 팔로워 수 감소
//       }
//     });
//   }
// });

// 팔로워 목록 조회
