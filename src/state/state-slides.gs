function exportStateChartsAndSummary() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const selectedState = dashboard.getRange("B12").getValue();

  if (!selectedState) {
    SpreadsheetApp.getUi().alert("Please select a state first.");
    return;
  }

  const presentation = SlidesApp.create(`${selectedState} Security Report`);

  const metrics = ["Fatality", "Kidnapped", "Injury"];

  metrics.forEach(metric => {

    const slide = presentation.appendSlide(
      SlidesApp.PredefinedLayout.BLANK
    );

    addStateChartsToSlide(slide, selectedState, metric, ss);

    addTextSlide(
      presentation,
      createStateSummary(ss, selectedState, metric)
    );

  });

  addStatePieChartsToSlides(presentation, ss, selectedState);

  dashboard.getRange("B8")
    .setValue(presentation.getUrl());

  SpreadsheetApp.getUi().alert(
    `State Slides report created for ${selectedState}`
  );
}

function addStateChartsToSlide(slide, state, metric, ss) {

  const sh = ss.getSheetByName(`STATE_${state}_${metric}`);
  if (!sh) return;

  const charts = sh.getCharts();
  if (!charts || charts.length === 0) return;

  const img = charts[0].getAs("image/png");

  const pic = slide.insertImage(img);

  pic.setLeft(180)
     .setTop(80)
     .setWidth(500)
     .setHeight(400);
}

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