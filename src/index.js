import Notiflix from 'notiflix';
import Axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '28245233-b42719d95300d696a532045bb';
const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  btn: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
let page = 1;
let totalImages = 0;

refs.searchForm.addEventListener('submit', searchImage);
refs.btn.addEventListener('click', onLoadMore);

refs.btn.style.display = 'none';

async function fetchImages(query) {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    });
    const url = `${BASE_URL}?${searchParams}`;
    const searchResponse = await Axios.get(url);
    console.log(searchResponse.data.totalHits);
    return searchResponse.data.hits;
  } catch (error) {
    console.log(error);
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
  <div class="img-thumb">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
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
  </a>
</div>`
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

const clearImageCard = () => {
  refs.galleryContainer.innerHTML = '';
};

function onEmptyResponse() {
  Notiflix.Notify.info(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

async function searchImage(e) {
  try {
    e.preventDefault();
    clearImageCard();
    const searchQuery = refs.input.value.trim();
    const responseImages = await fetchImages(searchQuery);
    await renderImageCard(responseImages);
    page += 1;
    refs.btn.style.display = 'block';

    if (searchQuery === '' || searchQuery === ' ' || searchQuery.length === 0) {
      page = 1;
      refs.btn.style.display = 'none';
      onEmptyResponse();
      clearImageCard();
      return;
    }
    console.log(responseImages);
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  try {
    page += 1;
    const searchQuery = refs.input.value.trim();
    const responseImages = await fetchImages(searchQuery);
    await renderImageCard(responseImages);
  } catch (error) {
    console.log(error.message);
  }
}

// const onTheEnd = data => {
//   totalImages += data.hits;
//   if (data.totalHits <= totalImages) {
//     refs.btn.style.display = 'none';
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// };

// const totalPages = Math.ceil(responseImages.data.totalHits / 40);
// if (page > totalPages) {
//   Notiflix.Notify.info(
//     "We're sorry, but you've reached the end of search results."
//   );
// }
