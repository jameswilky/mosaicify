import keys from "../keys.js";
import { getBase64Image } from "./utilities.js";
export default (limit = 3) => {
  const key = keys.PIXABAY_API_KEY;
  const url = `https://pixabay.com/api/?key=${key}&safesearch=true&per_page=${limit}`;

  // todo find way of removing transparent images
  // As defined by documentation https://pixabay.com/api/docs/
  const colors = [
    "",
    "grayscale",
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

  // TOOD we are currently taking the first responce from each page, but this might mean we are getting the same image for each color
  const toQuery = q => {
    return q.replace(" ", "+");
  };

  const createAPICalls = q => {
    return colors.map(color => `${url}&q=${color}+${toQuery(q)}`);
  };

  const getImage = async q => {
    const res = await fetch(`${url}&q=${toQuery(q)}`);
    const data = await res.json();
    const webformatURL = await fetch(data.hits[0].webformatURL);
    const src = await getBase64Image(webformatURL.url);
    return {
      src: src,
      width: data.hits[0].webformatWidth,
      height: data.hits[0].webformatHeight
    };
  };
  const getImages = async q => {
    // Querys API and finds images for each color
    return new Promise(async resolve => {
      const urls = createAPICalls(q);
      const results = await Promise.all(
        urls.map(url => fetch(url).then(res => res.json()))
      );

      const imageUrls = await Promise.all(
        results
          .map(result => {
            return result.hits.map(({ previewURL }) => {
              return fetch(previewURL).then(img => img.url);
            });
          })
          .flat()
      );

      const paths = imageUrls.map(url => getBase64Image(url));

      const allPaths = await Promise.all(paths);
      resolve(allPaths.unique()); // Only returns unique values
    });
  };

  return { getImage, getImages };
};
