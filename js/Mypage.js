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
