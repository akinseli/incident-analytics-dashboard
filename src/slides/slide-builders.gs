function addChartsToSlide(slide, regions, metric, ss) {
  const SIZE = 300;
  const LEFTS = [60, 390, 720];

  regions.forEach((region, index) => {
    const sheet = ss.getSheetByName(`${region}_Top10_${metric}`);
    if (!sheet) return;

    const charts = sheet.getCharts();
    if (!charts || charts.length === 0) return;

    const chartImage = charts[0].getAs("image/png");

    const image = slide.insertImage(chartImage);

    image
      .setLeft(LEFTS[index] || 60)
      .setTop(80)
      .setWidth(SIZE)
      .setHeight(SIZE);
  });
}

function addNorthSouthPieCharts(presentation, ss) {
  const sheet = ss.getSheetByName("North_vs_South_Pie_Charts");
  if (!sheet) return;

  const charts = sheet.getCharts();
  if (!charts || charts.length === 0) return;

  const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  const LEFTS = [80, 400, 720];
  const SIZE = 300;

  charts.slice(0, 3).forEach((chart, i) => {
    const image = chart.getAs("image/png");

    const pic = slide.insertImage(image);

    pic
      .setLeft(LEFTS[i] || 80)
      .setTop(90)
      .setWidth(SIZE)
      .setHeight(SIZE);
  });
}

function addTextSlide(presentation, content) {
  const slide = presentation.appendSlide(
    SlidesApp.PredefinedLayout.TITLE_AND_BODY
  );

  const titleShape = slide.getPlaceholder(SlidesApp.PlaceholderType.TITLE);
  const bodyShape = slide.getPlaceholder(SlidesApp.PlaceholderType.BODY);

  if (titleShape) {
    titleShape.asShape().getText().setText(content.title || "");
  }

  if (bodyShape) {
    bodyShape.asShape().getText().setText(content.text || "");
  }
}