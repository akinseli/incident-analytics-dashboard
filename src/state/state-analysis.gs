

// STATE ANALYSIS ENGINE


function analyzeSingleState_FromDashboard() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = ss.getSheetByName("Dashboard");
  const selectedState = dashboard.getRange("B12").getValue();

  if (!selectedState) {
    SpreadsheetApp.getUi().alert("Please select a state first.");
    return;
  }

  const regions = ["ss", "sw", "se", "nc", "ne", "nw"];

  const COL_LGA = 4;
  const COL_STATE = 5;
  const COL_INCIDENT_TYPE = 6;
  const COL_INJURY = 9;
  const COL_FATALITY = 10;
  const COL_KIDNAPPED = 11;

  const toNumber = v =>
    (v === "" || v === "NIL" || v == null || isNaN(v)) ? 0 : Number(v);

  let rows = [];


  regions.forEach(region => {

    const sh = ss.getSheetByName(region);
    if (!sh) return;

    const data = sh.getDataRange().getValues();
    data.shift();

    data.forEach(r => {
      if (String(r[COL_STATE]).trim().toLowerCase() ===
          String(selectedState).trim().toLowerCase()) {
        rows.push(r);
      }
    });
  });

  if (rows.length === 0) {
    SpreadsheetApp.getUi().alert("No data found for selected state.");
    return;
  }


  let aggregated = {};

  rows.forEach(row => {

    const lga = row[COL_LGA];
    const incidentType = row[COL_INCIDENT_TYPE];

    if (!lga) return;

    if (!aggregated[lga]) {
      aggregated[lga] = {
        lga,
        injury: 0,
        fatality: 0,
        kidnapped: 0,
        injuryIncidents: {},
        fatalityIncidents: {},
        kidnappedIncidents: {}
      };
    }

    const injury = toNumber(row[COL_INJURY]);
    const fatality = toNumber(row[COL_FATALITY]);
    const kidnapped = toNumber(row[COL_KIDNAPPED]);

    aggregated[lga].injury += injury;
    aggregated[lga].fatality += fatality;
    aggregated[lga].kidnapped += kidnapped;

    if (incidentType) {
      if (injury > 0)
        aggregated[lga].injuryIncidents[incidentType] =
          (aggregated[lga].injuryIncidents[incidentType] || 0) + injury;

      if (fatality > 0)
        aggregated[lga].fatalityIncidents[incidentType] =
          (aggregated[lga].fatalityIncidents[incidentType] || 0) + fatality;

      if (kidnapped > 0)
        aggregated[lga].kidnappedIncidents[incidentType] =
          (aggregated[lga].kidnappedIncidents[incidentType] || 0) + kidnapped;
    }
  });

  const result = Object.values(aggregated);

  
  writeStateOutput(ss, selectedState, "Injury", result);
  writeStateOutput(ss, selectedState, "Fatality", result);
  writeStateOutput(ss, selectedState, "Kidnapped", result);

  SpreadsheetApp.getUi().alert(
    `State analysis completed for ${selectedState}`
  );
}



function writeStateOutput(ss, state, metric, data) {

  const key = metric.toLowerCase();

  const sheetName = `STATE_${state}_${metric}`;

  let sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);
  else sh.clear();

  const output = data
    .sort((a, b) => b[key] - a[key])
    .map(r => [
      state,
      r.lga,
      r[key],
      Object.keys(r[key + "Incidents"])
        .map(k => `${k} (${r[key + "Incidents"][k]})`)
        .join(", ")
    ]);

  sh.getRange(1, 1, 1, 4).setValues([[
    "State", "LGA", metric, "Incident Types"
  ]]);

  if (output.length > 0) {
    sh.getRange(2, 1, output.length, 4).setValues(output);
  }
}



function RUN_STATE_01_ANALYZE() {
  analyzeSingleState_FromDashboard();
}