const gridTemplate = mosaic => {
  const { width, height, nCols, nRows, fragments } = mosaic;

  const Grid = () => {
    fragments.map();
  };

  const styles = {
    container: `
    width: ${width}px;
    height: ${height}px;
    background-color: gainsboro;

    display: grid;
    grid-template-rows: repeat(${nRows}, 1fr);
    grid-template-columns: repeat(${nCols}, 1fr);
    `
  };

  return `
  <div style="${styles.container}">
  </div>
  `;
};

export default gridTemplate;
