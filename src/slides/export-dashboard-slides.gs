function exportAllChartsAndSummaries_FINAL_DASHBOARD() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");

  const presentation = SlidesApp.create("Regional Security Charts Report");

  const south = ["ss", "sw", "se"];
  const north = ["nc", "ne", "nw"];
  const metrics = ["Fatality", "Kidnapped", "Injury"];

  metrics.forEach(metric => {

    const southSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    addChartsToSlide(southSlide, south, metric, ss);
    addTextSlide(
      presentation,
      createRegionSummary(ss, south, metric, "Southern")
    );

    const northSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    addChartsToSlide(northSlide, north, metric, ss);
    addTextSlide(
      presentation,
      createRegionSummary(ss, north, metric, "Northern")
    );
  });

  addTextSlide(
    presentation,
    createNationalSummary(ss)
  );

  generateNorthSouthPieCharts();

  if (dashboard) {
    dashboard.getRange("B8")
      .setValue(presentation.getUrl());
  }
}