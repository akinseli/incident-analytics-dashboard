function generateRegionalBarCharts() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const regions = CONFIG.REGIONS;
  const metrics = Object.values(CONFIG.METRICS);

  const metricColors = {
    Injury: "#0000FF",
    Fatality: "#FF0000",
    Kidnapped: "#FFD700"
  };

  regions.forEach(region => {

    metrics.forEach(metric => {

      const sheetName = `${region}_Top10_${metric}`;
      const sh = ss.getSheetByName(sheetName);
      if (!sh) return;

      sh.getCharts().forEach(c => sh.removeChart(c));

      const lastRow = sh.getLastRow();
      if (lastRow < 2) return;

      // Force numeric values in column C
      const range = sh.getRange(2, 3, lastRow - 1, 1);
      const fixed = range.getValues().map(r => [Number(r[0]) || 0]);
      range.setValues(fixed);

      // IMPORTANT: ONLY LGA (col B) + VALUE (col C)
      const chartRange = sh.getRange(2, 2, lastRow - 1, 2);

      const chart = sh.newChart()
        .setChartType(Charts.ChartType.COLUMN)
        .addRange(chartRange)
        .setPosition(2, 6, 0, 0)
        .setOption("title", `${region.toUpperCase()} - ${metric} by LGA`)
        .setOption("titleTextStyle", { bold: true, fontSize: 16 })
        .setOption("legend", { position: "none" })
        .setOption("hAxis", {
          title: "LGA",
          textStyle: { bold: true }
        })
        .setOption("vAxis", {
          title: metric,
          textStyle: { bold: true }
        })
        .setOption("colors", [metricColors[metric]])
        .setOption("is3D", true)
        .build();

      sh.insertChart(chart);
    });
  });
}