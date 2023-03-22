import axios from 'axios';

export default getPopularMovies = (successCallback: any) => {
  axios
    .get(
      'https://api.themoviedb.org/3/movie/popular?api_key=afc5f8fe85b8803c153f601fda8cb046',
    )
    .then(res => {
      successCallback(res.data.results);
    })
    .catch(err => {
      console.log(err);
    });
};
