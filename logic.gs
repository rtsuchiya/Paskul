// 定数を宣言する
var PASKUL_SPREAD_SHEET_ID_KEY = "dARWu1HLtyWhXsS0";
var PASKUL_SPREAD_SHEET_NAME = "Paskul_SpreadSheet";
var PASKUL_SHEET_NAME = "シート1";
var PASKUL_SPREAD_SHEET_HEADER = ["サービス名","パスワード","生成日時"];

/**
* GETリクエストに対応するスクリプト
*/
function doGet(e) {
  // 利用ユーザのユーザプロパティからスプレッドシートキーの取得を試みる
  var userProperties = PropertiesService.getUserProperties();
  var spreadSheetId = userProperties.getProperty(PASKUL_SPREAD_SHEET_ID_KEY);
  
  // キーが取得できない(=初利用)の場合はスプレッドシートを作成する
  if (!spreadSheetId) {
    var newSpreadSheet = SpreadsheetApp.create(PASKUL_SPREAD_SHEET_NAME);
    var activeSheet = newSpreadSheet.getActiveSheet();
    activeSheet.appendRow(PASKUL_SPREAD_SHEET_HEADER);
    userProperties.setProperty(PASKUL_SPREAD_SHEET_ID_KEY, newSpreadSheet.getId());
  }

  return HtmlService.createTemplateFromFile("index")
      .evaluate()
      .setTitle("Paskul")
      .addMetaTag("viewport", "width=device-width");
}

/**
* POSTリクエストで対応するスクリプト
*/
function doPost(e) {
  // パラメータを取得する
  var password = e.parameter.password;
  var serviceName = e.parameter.service_name;
  
  // 未入力項目があったらエラー画面に遷移させる
  if (!password || !serviceName) {
    // error.htmlを表示させる
    return HtmlService.createTemplateFromFile("error").evaluate();
  }
  
  // 利用ユーザのスプレッドシートのシートを取得する
  var spreadSheetId = PropertiesService.getUserProperties().getProperty(PASKUL_SPREAD_SHEET_ID_KEY);
  var sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(PASKUL_SHEET_NAME);
  
  // 最終行に新しいレコードを追加する
  sheet.appendRow([serviceName, password, new Date()]);
  
  return HtmlService.createTemplateFromFile("index").evaluate();
}

/**
* スプレッドシートの中のパスワード一覧を返却する
*/
function getPasswordList() {
  // 利用ユーザのスプレッドシートのシートを取得する
  var spreadSheetId = PropertiesService.getUserProperties().getProperty(PASKUL_SPREAD_SHEET_ID_KEY);
  var sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(PASKUL_SHEET_NAME);
  
  // パスワードの一覧を取得して返却する
  return sheet.getDataRange().getValues();
}