function writeOutputSheet(ss, sheetName, headers, data) {
  let sh = ss.getSheetByName(sheetName);

  if (!sh) {
    sh = ss.insertSheet(sheetName);
  } else {
    sh.clear();
  }

  const finalData = [headers, ...data];

  sh.getRange(1, 1, finalData.length, headers.length)
    .setValues(finalData);
}