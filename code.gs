// the name of the sheet within your document
var sheetName = "Sheet1";

function insertXmlData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(this.sheetName);
  xmlData = getXmlData();
  var rowData = [];
  //sheet.appendRow([Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"), accountdata.followerCount, accountdata.followCount, accountdata.mediaCount,accountdata.totalLikes, accountdata.totalComments, accountdata.EngagementRatio]);
  if(xmlData[0]){
    for (xd in xmlData[0]){

      sheet.appendRow( [ xmlData[0][xd],xmlData[1][xd], xmlData[2][xd], xmlData[3][xd], xmlData[4][xd], xmlData[5][xd], xmlData[6][xd]  ] );
    }
  }
 };

//if you want to use another timezone, you can adjust the timezone by using GMT+01:00 , GMT+06:00, GMT-06:00 ...

function getXmlData() {
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
  var matchDateTime = [];
  var league = [];
  var home = [];
  var away = [];
  var odd_arr = [];
  var odd2 = [];
  var oddx = [];
  var odd1 = [];

  for (i in cinfos){
    var matches = cinfos[i].getChildren("Matches")[0].getChildren("MatchInfo");
    for (j in matches){
      matchDateTime.push( matches[j].getAttribute("MatchDateTime").getValue() );
      league.push( matches[j].getAttribute("League").getValue() );
      home.push( matches[j].getAttribute("Home").getValue() );
      away.push( matches[j].getAttribute("Away").getValue() );
      //result.push( matchDateTime, league, home, away );
      var pools = matches[j].getChildren("Pools");

      for (p in pools){
        var pinfos = pools[p].getChildren("PoolInfo");
        for (k in pinfos){
          var oinfos = pinfos[k].getChildren("OddsSet");

            for(u in oinfos){
              var odds = oinfos[u].getChildren("OddsInfo");
              for (o in odds){

                if( odds[o].getAttribute("Number").getValue() == "2" ){
                  odd2.push( odds[o].getAttribute("Value").getValue() );
                }else if( odds[o].getAttribute("Number").getValue() == "X" ){
                  oddx.push( odds[o].getAttribute("Value").getValue()  );
                }else if( odds[o].getAttribute("Number").getValue() == "1" ){
                  odd1.push( odds[o].getAttribute("Value").getValue()  );
                }
              }
              //odd_arr.push(odd);
            }

        }
      }
      result.push( matchDateTime, league, home, away, odd2, oddx, odd1 );

    }
  }
  //ref: https://developers.google.com/apps-script/reference/xml-service/element
  //ref: https://stackoverflow.com/questions/19865686/google-apps-script-parsing-xml-results-in-error-cannot-find-function-getchild
  return result;
}
