function clearGeneratedSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const keepExact = [
    "Dashboard",
    "ss", "sw", "se", "nc", "ne", "nw"
  ];

  const sheets = ss.getSheets();

  for (let i = sheets.length - 1; i >= 0; i--) {

    const sheet = sheets[i];
    const name = sheet.getName();

    const isCoreSheet = keepExact.includes(name);

    const isSystemSheet =
      name.startsWith("STATE_") ||
      name.includes("_Top10_") ||
      name === "North_vs_South_Charts";

    if (!isCoreSheet && isSystemSheet) {
      ss.deleteSheet(sheet);
    }
  }

  SpreadsheetApp.getUi().alert(
    "Generated analysis sheets cleared successfully!"
  );
}