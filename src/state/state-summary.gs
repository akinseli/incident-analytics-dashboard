function createStateSummary(ss, state, metric) {

  const sh = ss.getSheetByName(`STATE_${state}_${metric}`);

  if (!sh || sh.getLastRow() < 2) {
    return {
      title: `${state} Summary`,
      text: "No data available."
    };
  }

  const data = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();

  data.sort((a, b) => (Number(b[2]) || 0) - (Number(a[2]) || 0));

  const total = data.reduce(
    (s, r) => s + (Number(r[2]) || 0),
    0
  );

  const top1 = data[0] || ["", "N/A", 0];
  const top2 = data[1] || ["", "N/A", 0];

  return {
    title: `${state} – ${metric} Overview`,
    text:
`${state} recorded ${total} ${metric.toLowerCase()} cases.

Highest were in ${top1[1]} (${top1[2]}) and ${top2[1]} (${top2[2]}).`
  };
}