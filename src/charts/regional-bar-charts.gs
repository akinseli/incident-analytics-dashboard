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

function generateStateBarCharts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const selectedState = dashboard.getRange("B12").getValue();

  if (!selectedState) {
    SpreadsheetApp.getUi().alert("Please select a state first.");
    return;
  }

  const metrics = ["Injury", "Fatality", "Kidnapped"];

  const metricColors = {
    Injury: "#0000FF",
    Fatality: "#FF0000",
    Kidnapped: "#FFD700"
  };

  metrics.forEach(metric => {

    const sheetName = `STATE_${selectedState}_${metric}`;
    const sh = ss.getSheetByName(sheetName);
    if (!sh) return;

    // remove old charts
    sh.getCharts().forEach(c => sh.removeChart(c));

    const lastRow = sh.getLastRow();
    if (lastRow < 2) return;

    // ensure numeric values
    const metricRange = sh.getRange(2, 3, lastRow - 1, 1);
    const cleanValues = metricRange.getValues().map(r => [Number(r[0]) || 0]);
    metricRange.setValues(cleanValues);

    /*
      ✅ FIX #1:
      Include header row properly
      Chart must understand structure:
      Column B = LGA (category)
      Column C = value (series)
    */

    const chartRange = sh.getRange(1, 2, lastRow, 2);

    const chart = sh.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(chartRange)
      .setPosition(2, 6, 0, 0)

      .setOption("title", `${selectedState} - ${metric} by LGA`)
      .setOption("titleTextStyle", {
        bold: true,
        fontSize: 16,
        color: "black"
      })

      .setOption("legend", { position: "none" })

      .setOption("hAxis", {
        title: "LGA",
        textStyle: { bold: true },
        slantedText: true,
        slantedTextAngle: 45
      })

      .setOption("vAxis", {
        title: metric,
        textStyle: { bold: true }
      })

      .setOption("colors", [metricColors[metric]])

     

      .build();

    sh.insertChart(chart);
  });
}