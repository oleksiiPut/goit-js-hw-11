// import axios from 'axios';

const API_KEY = '28245233-b42719d95300d696a532045bb';
const BASE_URL = 'https://pixabay.com/api/';
const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', searchImage);

// async function searchImage(e) {
//   e.preventDefault();
//   const result = await axios.get('${BASE_URL}', {
//     parameters: {
//       key: API_KEY,
//       q: e.target[0].value,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//     },
//   });
//   console.log(result);
// }
