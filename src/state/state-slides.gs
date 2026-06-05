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