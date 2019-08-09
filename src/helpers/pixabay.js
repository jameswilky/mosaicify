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

  const getImages = async q => {
    const urls = createAPICalls(q);
    const res = await fetch(urls[0]);
    const data = await res.json();
    const images = data.hits.map(({ previewURL }) => {
      return fetch(previewURL).then(img => img.url);
    });

    return Promise.all(images);
  };

  return {
    getImages
  };
};
