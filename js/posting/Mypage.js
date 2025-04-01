import {getUser} from '../component/get-user-id.js';
import createPostingHTML from './posting-list.js';

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

  // 게시글 상세
  const container = document.getElementById('posting');

  async function postingData() {
    const followerCnt = await getFollowers();
    const followCnt = await getFollows();

    document.getElementById('username').textContent =
      showData.email || '사용자 이름';

    document.getElementById('Followers').textContent =
      followerCnt.followers.length || 0;
    document.getElementById('Follow').textContent =
      followCnt.following.length || 0;

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

              // TODO : 여기서 클릭 시 모달창
              const postElement = document.createElement('div');
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
