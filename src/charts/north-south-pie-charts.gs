function generateNorthSouthPieCharts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const northSheets = ["nc", "ne", "nw"];
  const southSheets = ["ss", "sw", "se"];

  const METRICS = [
    { key: "fatality", label: "Fatality" },
    { key: "injury", label: "Injury" },
    { key: "kidnapped", label: "Kidnapped" }
  ];

  function aggregateRegionTotals(sheetNames) {
    const totals = {
      injury: 0,
      fatality: 0,
      kidnapped: 0
    };

    sheetNames.forEach(name => {
      const sh = ss.getSheetByName(name);
      if (!sh) return;

      const data = sh.getDataRange().getValues();
      if (data.length < 2) return;

      const headers = data[0].map(h => String(h).toLowerCase());

      const col = (k) => headers.findIndex(h => h.includes(k));

      const injuryCol = col("injury");
      const fatalityCol = col("fatality");
      const kidnapCol = col("kidnap");

      for (let i = 1; i < data.length; i++) {
        const row = data[i];

        const toNum = v => (v === "" || v === "NIL" || isNaN(v)) ? 0 : Number(v);

        if (injuryCol >= 0) totals.injury += toNum(row[injuryCol]);
        if (fatalityCol >= 0) totals.fatality += toNum(row[fatalityCol]);
        if (kidnapCol >= 0) totals.kidnapped += toNum(row[kidnapCol]);
      }
    });

    return totals;
  }

  const north = aggregateRegionTotals(northSheets);
  const south = aggregateRegionTotals(southSheets);

  const sheetName = "North_South_Pie_Charts";

  let sh = ss.getSheetByName(sheetName);
  if (sh) ss.deleteSheet(sh);
  sh = ss.insertSheet(sheetName);

  let row = 1;

  METRICS.forEach(metric => {

    const data = [
      ["Region", metric.label],
      ["North", north[metric.key]],
      ["South", south[metric.key]]
    ];

    sh.getRange(row, 1, data.length, 2).setValues(data);

    const chartRange = sh.getRange(row + 1, 1, 2, 2);

    const chart = sh.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(chartRange)
      .setPosition(row, 4, 0, 0)
      .setOption("title", `${metric.label}: North vs South`)
      .setOption("is3D", true)
      .setOption("pieSliceText", "value")
      .setOption("legend", {
        position: "right",
        textStyle: { bold: true }
      })
      .build();

    sh.insertChart(chart);

    row += 6;
  });
}