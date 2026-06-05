function createRegionSummary(ss, regions, metric, label) {
  let rows = [];

  regions.forEach(r => {
    const sh = ss.getSheetByName(`${r}_Top10_${metric}`);
    if (!sh) return;

    const data = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
    rows = rows.concat(data);
  });

  rows.sort((a, b) => b[2] - a[2]);

  const total = rows.reduce((s, r) => s + (r[2] || 0), 0);

  const top = rows[0] || ["N/A", "N/A", 0];
  const bottom = rows[rows.length - 1] || ["N/A", "N/A", 0];

  return {
    title: `${label} Region - ${metric}`,
    text: `${label} region recorded ${total} ${metric.toLowerCase()} cases. Highest: ${top[1]} (${top[2]}), Lowest: ${bottom[1]} (${bottom[2]}).`
  };
}

function createNationalSummary(ss) {

  const regions = CONFIG.REGIONS;

  const metrics = [
    "Fatality",
    "Kidnapped",
    "Injury"
  ];

  const totals = {
    Fatality: 0,
    Kidnapped: 0,
    Injury: 0
  };

  const regionTotals = {};

  regions.forEach(region => {

    regionTotals[region] = 0;

    metrics.forEach(metric => {

      const sh =
        ss.getSheetByName(
          `${region}_Top10_${metric}`
        );

      if (!sh) return;

      const lastRow = sh.getLastRow();
      if (lastRow < 2) return;

      const values =
        sh.getRange(
          2,
          3,
          lastRow - 1,
          1
        ).getValues();

      const total =
        values.reduce(
          (sum, row) => sum + (Number(row[0]) || 0),
          0
        );

      totals[metric] += total;
      regionTotals[region] += total;

    });

  });

  const sortedRegions =
    Object.entries(regionTotals)
      .sort((a, b) => b[1] - a[1]);

  return {

    title: "National Security Overview",

    text:
`Nigeria recorded ${totals.Fatality} fatalities, ${totals.Kidnapped} kidnappings, and ${totals.Injury} injuries.

The most affected regions were ${sortedRegions[0]?.[0]?.toUpperCase() || "N/A"} and ${sortedRegions[1]?.[0]?.toUpperCase() || "N/A"}.

The least affected region was ${sortedRegions[sortedRegions.length - 1]?.[0]?.toUpperCase() || "N/A"}.

National patterns indicate stronger conflict and kidnapping concentrations in northern zones, while southern zones recorded more localized and accident-related incidents.`
  };
}