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
    return Promise.all(paths);
  };

  return { getImage, getImages };
};
