async function getUser() {
  const ok = localStorage.getItem('userInfo');
  if (!ok) {
    window.localStorage.removeItem('userInfo');
    console.log(ok);
    // window.location.href = './login.html';
  } else {
    const res = await fetch(`http://13.217.186.188:7777/user/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();

    return showData;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const showData = await getUser();

  // 슬라이드 관련 요소 가져오기
  const slide = document.querySelector('.slide');
  const prevBtn = document.querySelector('.slide_prev_button');
  const nextBtn = document.querySelector('.slide_next_button');
  const pagination = document.querySelector('.slide_pagination');

  const getImg = localStorage.getItem('uploadedFiles');
  // console.log('로컬스토리지에서 가져온 데이터:', getImg);

  let uploadedFiles = [];
  if (getImg) {
    try {
      uploadedFiles = JSON.parse(getImg);
      if (!Array.isArray(uploadedFiles)) {
        console.error('데이터가 배열이 아닙니다:', uploadedFiles);
        uploadedFiles = [];
      }
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      uploadedFiles = [];
    }
  } else {
    console.log('로컬스토리지에서 업로드된 파일을 찾을 수 없습니다.');
  }

  console.log('파싱 후 업로드된 파일 배열:', uploadedFiles);

  // 슬라이드 초기화
  if (uploadedFiles.length > 0) {
    initSlideShow(uploadedFiles, slide, pagination);
    setSlideControls(uploadedFiles, slide, prevBtn, nextBtn, pagination);
  }

  document
    .getElementById('write-submit-btn')
    .addEventListener('click', async e => {
      e.preventDefault();

      if (confirm('정말로 업로드 하시겠습니까?')) {
        await handleUpload(uploadedFiles, showData?.id);
      }
    });
});

function initSlideShow(uploadedFiles, slide) {
  if (!Array.isArray(uploadedFiles) || uploadedFiles.length === 0) {
    console.warn('업로드된 파일이 없습니다.');
    return;
  }

  const fileData = Array.isArray(uploadedFiles[0]?.data)
    ? uploadedFiles[0].data
    : uploadedFiles;

  slide.innerHTML = '';

  fileData.forEach(v => {
    console.log(v.url);
    if (v?.type && v.type.includes('video')) {
      const videoElement = document.createElement('video');
      videoElement.src = v.url;
      videoElement.controls = true;
      videoElement.muted = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      slide.appendChild(videoElement);
    }
    // TODO : 미리보기용 이미지가 보이지 않음
    else if (v?.url) {
      const slideItem = document.createElement('div');
      slideItem.classList.add('slide_item');
      slideItem.style.backgroundImage = `url("${v.url}")`;
      slideItem.style.backgroundSize = 'cover';
      slideItem.style.backgroundPosition = 'center';
      slideItem.style.backgroundRepeat = 'no-repeat';
      slideItem.style.width = '100%';
      slideItem.style.height = '100%';
      slide.appendChild(slideItem);
    }
  });
}

function setupPagination(uploadedFiles, pagination) {
  pagination.innerHTML = '';
  uploadedFiles.forEach((_, index) => {
    const li = document.createElement('li');
    li.textContent = '•';
    if (index === 0) li.classList.add('active');
    pagination.appendChild(li);
  });
}

function setSlideControls(uploadedFiles, slide, prevBtn, nextBtn, pagination) {
  let currSlide = 0;
  updateSlidePosition(slide, currSlide, pagination);

  nextBtn.addEventListener('click', () => {
    currSlide = (currSlide + 1) % uploadedFiles.length;
    updateSlidePosition(slide, currSlide, pagination);
  });

  prevBtn.addEventListener('click', () => {
    currSlide = (currSlide - 1 + uploadedFiles.length) % uploadedFiles.length;
    updateSlidePosition(slide, currSlide, pagination);
  });

  pagination.querySelectorAll('li').forEach((item, index) => {
    item.addEventListener('click', () => {
      currSlide = index;
      updateSlidePosition(slide, currSlide, pagination);
    });
  });

  let startPoint = 0;
  slide.addEventListener('mousedown', e => {
    startPoint = e.pageX;
  });

  slide.addEventListener('mouseup', e => {
    const endPoint = e.pageX;
    if (startPoint < endPoint) {
      prevBtn.click();
    } else if (startPoint > endPoint) {
      nextBtn.click();
    }
  });
}

function updateSlidePosition(slide, currSlide, pagination) {
  const slideItems = slide.querySelectorAll('.slide_item');
  const offset = -currSlide * 100;

  slideItems.forEach(item => {
    item.style.transform = `translateX(${offset}%)`;
  });

  const paginationItems = pagination.querySelectorAll('li');
  paginationItems.forEach((item, index) => {
    item.classList.remove('active');
    if (index === currSlide) {
      item.classList.add('active');
    }
  });
}

async function handleUpload(uploadedFiles, username) {
  const postvalue = document.getElementById('write-input')?.value || '';

  console.log('dddd', postvalue);

  const formData = new FormData();
  formData.append('user_id', username);
  formData.append('body', postvalue);

  try {
    const blobFiles = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        if (!file.url) return null;

        const response = await fetch(file.url);
        const blob = await response.blob();

        return new File([blob], file.name || `file_${index}`, {
          type: blob.type,
        });
      }),
    );

    //  Blob=> 변환
    blobFiles.forEach((file, index) => {
      if (file) {
        formData.append('content', file, file.name);
      }
    });

    const req = await fetch('http://13.217.186.188:7777/posts', {
      method: 'POST',
      body: formData,
    });

    if (req.ok) {
      const res = await req.json();
      console.log('업로드 성공:', res);

      // window.location.href = '../main-page.html';
    } else {
      alert('업로드에 실패ㅠㅠㅠ');
    }
  } catch (error) {
    console.error('업로드 오류:', error);
    alert('업로드 중 오류');
  }
}
