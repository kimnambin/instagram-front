export default async function get_profile() {
  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get('user_id');

  try {
    // 팔로워 목록 조회
    async function getFollowers() {
      const res = await fetch(
        `http://13.217.186.188:7777/follow/followers/${user_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return await res.json(); // followerCnt 직접 반환
    }

    // 팔로잉 목록 조회
    async function getFollows() {
      const res = await fetch(
        `http://13.217.186.188:7777/follow/following/${user_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return await res.json(); // followCnt 직접 반환
    }

    // 게시글 가져오기
    async function postingData() {
      try {
        const followerCnt = await getFollowers();
        const followCnt = await getFollows();

        // showData가 정의되지 않음 → 여기서 데이터를 가져와야 함
        // const showData = {email}; // 예제 데이터 (실제로는 API에서 가져와야 함)

        // console.log('user Id', showData.email);
        // console.log('user email', email);

        // 프로필 정보 업데이트
        document.getElementById('username').textContent =
          user_id || '사용자 이름';

        document.getElementById('Followers').textContent = followerCnt || 0;
        document.getElementById('Follow').textContent = followCnt || 0;

        // 사용자 ID를 기반으로 게시물 요청
        const res = await fetch(
          `http://13.217.186.188:7777/posts?user_id=${user_id}`,
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
          postIds
            .sort((a, b) => b - a) // id 내림차순 정렬
            .map(async postId => {
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

              // detailPosts.contents.forEach(v => {
              const postElement = document.createElement('a');
              postElement.href = '#'; // 페이지 이동 기능 추가 가능
              const imageUrl = detailPosts.contents[0].url;
              postElement.innerHTML = `<img src="${imageUrl}" alt="이미지" class="post-img" />`;
              postsContainer.appendChild(postElement);
              // });
            }),
        );
      } catch (e) {
        console.error('게시물 가져오기 오류:', e);
      }
    }

    // 함수 실행
    await postingData();
  } catch (e) {
    console.error('프로필 가져오기 오류:', e);
  }
}

// 페이지 로드 시 실행
window.onload = get_profile;
