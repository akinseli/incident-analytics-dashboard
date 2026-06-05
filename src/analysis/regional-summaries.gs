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