function analyzeRegionalTopMetrics() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const regions = CONFIG.REGIONS;

  const COL_LGA = 4;
  const COL_STATE = 5;
  const COL_INCIDENT_TYPE = 6;
  const COL_INJURY = 9;
  const COL_FATALITY = 10;
  const COL_KIDNAPPED = 11;

  regions.forEach(region => {

    const sh = ss.getSheetByName(region);
    if (!sh) return;

    const values = sh.getDataRange().getValues();
    values.shift(); // remove header

    let aggregated = {};

    values.forEach(row => {

      const state = row[COL_STATE];
      const lga = row[COL_LGA];
      const incidentType = row[COL_INCIDENT_TYPE];

      if (!state || !lga) return;

      const key = `${state} - ${lga}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          state,
          lga,
          injury: 0,
          fatality: 0,
          kidnapped: 0,
          injuryIncidents: {},
          fatalityIncidents: {},
          kidnappedIncidents: {}
        };
      }

      const injury = toSafeNumber(row[COL_INJURY]);
      const fatality = toSafeNumber(row[COL_FATALITY]);
      const kidnapped = toSafeNumber(row[COL_KIDNAPPED]);

      aggregated[key].injury += injury;
      aggregated[key].fatality += fatality;
      aggregated[key].kidnapped += kidnapped;

      if (incidentType) {
        if (injury > 0) {
          aggregated[key].injuryIncidents[incidentType] =
            (aggregated[key].injuryIncidents[incidentType] || 0) + injury;
        }

        if (fatality > 0) {
          aggregated[key].fatalityIncidents[incidentType] =
            (aggregated[key].fatalityIncidents[incidentType] || 0) + fatality;
        }

        if (kidnapped > 0) {
          aggregated[key].kidnappedIncidents[incidentType] =
            (aggregated[key].kidnappedIncidents[incidentType] || 0) + kidnapped;
        }
      }
    });

    const result = Object.values(aggregated);

    const getTop10 = (metric, incidentField) => {
      return result
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, 10)
        .map(r => [
          r.state,
          r.lga,
          r[metric],
          formatIncidentTypes(r[incidentField])
        ]);
    };

    writeOutputSheet(
      ss,
      `${region}_Top10_Injury`,
      ["State", "LGA", "Injury", "Incident Types"],
      getTop10("injury", "injuryIncidents")
    );

    writeOutputSheet(
      ss,
      `${region}_Top10_Fatality`,
      ["State", "LGA", "Fatality", "Incident Types"],
      getTop10("fatality", "fatalityIncidents")
    );

    writeOutputSheet(
      ss,
      `${region}_Top10_Kidnapped`,
      ["State", "LGA", "Kidnapped", "Incident Types"],
      getTop10("kidnapped", "kidnappedIncidents")
    );

  });
}

function createRegionSummary(ss, regions, metric, label) {

  let rows = [];

  regions.forEach(region => {

    const sh = ss.getSheetByName(`${region}_Top10_${metric}`);
    if (!sh) return;

    const lastRow = sh.getLastRow();
    if (lastRow < 2) return;

    rows = rows.concat(
      sh.getRange(2, 1, lastRow - 1, 4).getValues()
    );

  });

  if (rows.length === 0) {
    return {
      title: `${label} Region - ${metric}`,
      text: `No ${metric.toLowerCase()} data available.`
    };
  }

  rows.sort((a, b) => b[2] - a[2]);

  const total = rows.reduce(
    (sum, row) => sum + (Number(row[2]) || 0),
    0
  );

  const top1 = rows[0] || ["", "N/A", 0];
  const top2 = rows[1] || ["", "N/A", 0];

  const low1 = rows[rows.length - 1] || ["", "N/A", 0];
  const low2 = rows[rows.length - 2] || ["", "N/A", 0];

  const causeTotals = {};

  rows.forEach(row => {

    const cause = row[3];
    const value = Number(row[2]) || 0;

    if (!cause) return;

    causeTotals[cause] =
      (causeTotals[cause] || 0) + value;

  });

  const dominantCauses =
    Object.entries(causeTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(item => item[0])
      .join(" and ") || "multiple incident types";

  return {

    title: `${label} Region – ${metric} Overview`,

    text:
`The ${label} region recorded ${total} ${metric.toLowerCase()} cases.

The dominant contributing incident types were ${dominantCauses}.

The highest levels were recorded in ${top1[1]} (${top1[2]}) and ${top2[1]} (${top2[2]}).

The lowest levels were observed in ${low1[1]} (${low1[2]}) and ${low2[1]} (${low2[2]}).`
  };
}