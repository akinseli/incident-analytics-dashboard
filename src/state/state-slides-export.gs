function addStatePieChartsToSlides(presentation, ss, selectedState) {

  const sh = ss.getSheetByName(`STATE_${selectedState}_PieCharts`);
  if (!sh) return;

  const charts = sh.getCharts();
  if (!charts || charts.length === 0) return;

  const slide = presentation.appendSlide(
    SlidesApp.PredefinedLayout.BLANK
  );

  const lefts = [60, 390, 720];

  charts.slice(0, 3).forEach((chart, i) => {

    const img = chart.getAs("image/png");

    const pic = slide.insertImage(img);

    pic.setLeft(lefts[i])
       .setTop(90)
       .setWidth(280)
       .setHeight(280);
  });
}