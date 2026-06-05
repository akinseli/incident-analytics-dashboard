function addChartsToSlide(slide, regions, metric, ss) {
  const size = 300;
  const lefts = [60, 390, 720];

  regions.forEach((r, i) => {
    const sh = ss.getSheetByName(`${r}_Top10_${metric}`);
    if (!sh || sh.getCharts().length === 0) return;

    const img = sh.getCharts()[0].getAs("image/png");
    const pic = slide.insertImage(img);

    pic.setLeft(lefts[i]).setTop(80);
    pic.setWidth(size).setHeight(size);
  });
}