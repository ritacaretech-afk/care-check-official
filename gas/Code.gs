const SHEET_NAME = 'CareCheckData';

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'getAll') {
      return jsonResponse({ ok: true, data: getAllData() });
    }
    return jsonResponse({ ok: false, error: 'unknown action' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'saveAll') {
      saveAllData(body.data || {});
      return jsonResponse({ ok: true, savedAt: new Date().toISOString() });
    }
    return jsonResponse({ ok: false, error: 'unknown action' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1).setValue('json');
    sheet.getRange(1, 2).setValue('updatedAt');
  }
  return sheet;
}

function getAllData() {
  const sheet = getSheet();
  const json = sheet.getRange(2, 1).getValue();
  if (!json) {
    return {
      residents: {},
      staff: ['井上', '山田', '佐藤', '鈴木'],
      meals: {},
      excretions: {},
      vitals: {},
      weights: {},
      positions: {},
      handovers: {},
      notificationHistory: []
    };
  }
  return JSON.parse(json);
}

function saveAllData(data) {
  const sheet = getSheet();
  sheet.getRange(2, 1).setValue(JSON.stringify(data));
  sheet.getRange(2, 2).setValue(new Date());
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
