import keys from "../../keys.js";
import getBase64Image from "../helpers/getBase64Image.js";
export default (limit = 3) => {
  const key = keys.PIXABAY_API_KEY;
  const url = `https://pixabay.com/api/?key=${key}&image_type=photo&safesearch=true&per_page=${limit}`;

  // As defined by documentation https://pixabay.com/api/docs/
  const colors = [
    "grayscale",
    "transparent",
    "red",
    "orange",
    "yellow",
    "green",
    "turquoise",
    "blue",
    "lilac",
    "pink",
    "white",
    "gray",
    "black",
    "brown"
  ];

  const toQuery = q => {
    return q.replace(" ", "+");
  };

  const createAPICalls = q => {
    return colors.map(color => `${url}&q=${toQuery(q)}&color=${color}`);
  };

  const getImage = async q => {
    const res = await fetch(`${url}&q=${toQuery(q)}`);
    const data = await res.json();

    return fetch(data.hits[0].webformatURL).then(img => img.url);
  };
  const getImages = async q => {
    // Querys API and finds images for each color
    const urls = createAPICalls(q);
    const results = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    const images = results.map(result => {
      return result.hits.map(({ previewURL }) => {
        return fetch(previewURL).then(img => img.url);
      });
    });

    return Promise.all(images.flat());
  };

  return { getImage, getImages };
};
