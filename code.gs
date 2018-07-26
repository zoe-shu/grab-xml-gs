// the name of the sheet within your document
var sheetName = "Sheet1";

function insertXmlData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(this.sheetName);
  home = getXmlData(this.instagramAccountName);
  //sheet.appendRow([Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"), '', '']);
  for (h in home){
    sheet.appendRow(['','',home[h]]);
  }
  //sheet.appendRow(accountdata);
 };

//if you want to use another timezone, you can adjust the timezone by using GMT+01:00 , GMT+06:00, GMT-06:00 ...

function getXmlData(username) {
  var r = new RegExp('<script type="text\/javascript">' +
                   '([^{]+?({.*profile_pic_url.*})[^}]+?)' +
                   '<\/script>');
  var url = "";
  var ignoreError = {
   "muteHttpExcecptions":true
  };
  var source = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(source);
  var root = document.getRootElement();
  var cinfos = root.getChild("Coupons").getChildren("CouponInfo");
  //var matches = root.getChild("Coupons").getChild("CouponInfo").getChild("Matches").getChildren("MatchInfo");

  var result = [];
  //var matches = [];

  for (i in cinfos){
    var matches = cinfos[i].getChildren("Matches")[0].getChildren("MatchInfo");
    for (j in matches){
      result.push( matches[j].getAttribute("Home").getValue() );

    }
  }
  //ref: https://developers.google.com/apps-script/reference/xml-service/element
  //ref: https://stackoverflow.com/questions/19865686/google-apps-script-parsing-xml-results-in-error-cannot-find-function-getchild
  return result;
}
