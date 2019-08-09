const gridTemplate = mosaic => {
  const { width, height, nCols, nRows, fragments } = mosaic;

  const styles = {
    container: `
    width: ${width}px;
    height: ${height}px;
    background-color: gainsboro;

    display: grid;
    grid-template-rows: repeat(${nRows}, 1fr);
    grid-template-columns: repeat(${nCols}, 1fr);
    `,
    item: `
    display: grid; 
    width: ${width / nCols}px; 
    height: ${height / nRows}px;
    `
  };

  return `
  <div style="${styles.container}">
    ${fragments
      .map(
        ({ mosaicImage }) =>
          `<img style="${styles.item}" src=${mosaicImage.src}>`
      )
      .join("")} 
  </div>
  `;
};

export default gridTemplate;
