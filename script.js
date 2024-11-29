const flagEl = document.getElementById("flag");
const rows = 50;
const columns = 75;
const generateUnit = (columnNum, rowNum) => {
  const flagUnit = document.createElement("div");
  flagUnit.classList.add("flag-unit");
  const centerRow = Math.floor(rows / 2);
  const centerColumn = Math.floor(columns / 2);
  const starOutlinePoints = [
    [0, -17],
    [5, -5],
    [16, -5],
    [6, 3],
    [10, 15],
    [0, 8],
    [-10, 15],
    [-6, 3],
    [-15, -4],
    [-4, -5]
  ];
  const isInsideStar = (columnNum, rowNum) => {
    const points = starOutlinePoints.map(([dx, dy]) => [
      centerColumn + dx,
      centerRow + dy
    ]);
    const [x, y] = [columnNum, rowNum];
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      const intersect =
        yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };
  if (isInsideStar(columnNum, rowNum)) {
    flagUnit.style.background = "yellow";
  }
  flagUnit.style.setProperty("animation-delay", `${columnNum * 10}ms`);
  flagUnit.style.setProperty("--displacement", `${columnNum / 4}px`);
  const column = document.getElementById(`column-${columnNum}`);
  column.innerHTML += flagUnit.outerHTML;
};
for (let i = 0; i < columns; i++) {
  flagEl.innerHTML += `<div class="column" id="column-${i}"></div>`;
  for (let j = 0; j < rows; j++) {
    generateUnit(i, j);
  }
}