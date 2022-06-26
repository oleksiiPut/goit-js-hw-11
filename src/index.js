import Notiflix from 'notiflix';
import Axios from 'axios';

const API_KEY = '28245233-b42719d95300d696a532045bb';
const BASE_URL = 'https://pixabay.com/api/';

let page = 1;

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', searchImage);

async function fetchImages(e) {
  e.preventDefault();
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: e.target[0].value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    });
    const url = `${BASE_URL}?${searchParams}`;
    const searchResponse = await Axios.get(url);
    console.log(searchResponse.data.hits);
    return searchResponse.data.hits;
  } catch (error) {
    console.log(error);
  }
}

function onEmptyResponse() {
  Notiflix.Notify.info(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function searchImage(e) {
  e.preventDefault();
  const responseImage = e.target.value.trim();
  try {
    fetchImages(responseImage).then(response => {
      if (response.hits.length === 0) {
        onEmptyResponse();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

function renderImageCard(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>${likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${views} Views</b>
    </p>
    <p class="info-item">
      <b>${comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads} Downloads</b>
    </p>
  </div>
</div>`
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

const clearImageCard = () => {
  refs.galleryContainer.innerHTML = '';
};
