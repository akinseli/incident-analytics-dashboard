function generateStatePieCharts() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const selectedState = dashboard.getRange("B12").getValue();

  if (!selectedState) {
    SpreadsheetApp.getUi().alert("Please select a state first.");
    return;
  }

  const metrics = [
    { key: "Injury", col: 1 },
    { key: "Kidnapped", col: 6 },
    { key: "Fatality", col: 11 }
  ];

  const sheetName = `STATE_${selectedState}_PieCharts`;

  let out = ss.getSheetByName(sheetName);

  if (out) {
    out.clear();
    out.getCharts().forEach(c => out.removeChart(c));
  } else {
    out = ss.insertSheet(sheetName);
  }

  metrics.forEach((metric, index) => {

    const sh = ss.getSheetByName(`STATE_${selectedState}_${metric.key}`);
    if (!sh) return;

    const lastRow = sh.getLastRow();
    if (lastRow < 2) return;

    const raw = sh.getRange(2, 2, lastRow - 1, 2).getValues();

    const filtered = raw
      .map(r => [r[0], Number(r[1]) || 0])
      .filter(r => r[1] > 0);

    if (filtered.length === 0) return;

    const startCol = index * 6 + 1;

    out.getRange(1, startCol, filtered.length, 2)
      .setValues(filtered);

    const chartRange = out.getRange(1, startCol, filtered.length, 2);

    const chart = out.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(chartRange)
      .setPosition(8, startCol, 0, 0)
      .setOption("title", `${selectedState} – ${metric.key} by LGA`)
      .setOption("pieSliceText", "value")
      .setOption("legend", {
        position: "right",
        textStyle: { bold: true }
      })
      .setOption("titleTextStyle", {
        bold: true,
        fontSize: 14
      })
      .build();

    out.insertChart(chart);
  });
}