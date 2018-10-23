// ==UserScript==
// @name        google_flights_get_unavailable_prices
// @namespace   https://github.com/jmegner
// @version     0.1
// @description for getting unavailable prices for google flights results
// @license     Unlicense
// @homepageURL https://github.com/jmegner/greasemonkey_google_flights_get_unavailable_prices
// @supportURL  https://github.com/jmegner/greasemonkey_google_flights_get_unavailable_prices/issues
// @match       https://www.google.com/flights*
// @grant       GM.xmlHttpRequest
// @run-at      document-end
// ==/UserScript==

console.debug("jme begin");

(new MutationObserver(checkForResults)).observe(
  document,
  {childList: true, subtree: true});

/* // example page request for later reference
GM.xmlHttpRequest({
  method: "GET",
  url: "http://www.google.com/",
  onload: function(response) {
    console.debug("jme response...");
    console.debug(response);
    var responseDom = new DOMParser().parseFromString(response.responseText, "text/html");
    console.debug("jme parsed response...");
    console.debug(responseDom);
  }
});
*/

/* // southwest URL for later reference
var southwestUrl = "https://www.southwest.com/air/booking/select.html"
  + "?originationAirportCode=HOU"
  + "&destinationAirportCode=FLL"
  + "&returnAirportCode="
  + "&departureDate=2018-11-07"
  + "&departureTimeOfDay=ALL_DAY"
  + "&returnDate=2018-11-11"
  + "&returnTimeOfDay=ALL_DAY"
  + "&adultPassengersCount=1"
  + "&seniorPassengersCount=0"
  + "&fareType=USD"
  + "&passengerType=ADULT"
  + "&tripType=roundtrip"
  + "&promoCode="
  + "&reset=true"
  + "&redirectToVision=true"
  + "&int=HOMEQBOMAIR"
  + "&leapfrogRequest=true";
*/

function checkForResults(changes, observer)
{
  //console.debug("jme checkForResults begin");
  var dominatedList = document.querySelector('ol.gws-flights-results__has-dominated');

  if(dominatedList)
  {
    observer.disconnect();
    modifySouthwestEntries(dominatedList);
  }

  //console.debug("jme checkForResults end")
}


function modifySouthwestEntries(dominatedList)
{
  console.debug("jme modifySouthwestEntries begin");

  var southwestFlightXPathResult = document.evaluate(
    ".//li[contains(@class, 'gws-flights-results__result-item') and contains(.//span, 'Southwest')]",
    dominatedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  console.debug("jme found " + southwestFlightXPathResult.snapshotLength + " flights");

  for(var snapshotIdx = 0; snapshotIdx < southwestFlightXPathResult.snapshotLength; snapshotIdx++)
  {
    var southwestFlightListItem = southwestFlightXPathResult.snapshotItem(snapshotIdx);
    modifySouthwestEntry(southwestFlightListItem);
  }

  console.debug("jme modifySouthwestEntries end");
}


function modifySouthwestEntry(flightListItem)
{
  console.debug("jme modifySouthwestEntry begin");
  console.debug(flightListItem);

  var priceXpathResult = document.evaluate(
    ".//jsl[text()='Price unavailable']",
    flightListItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for(var priceIdx = 0; priceIdx < priceXpathResult.snapshotLength; priceIdx++)
  {
    var priceNode = priceXpathResult.snapshotItem(priceIdx);
    priceNode.innerText = "PRICE_GOES_HERE_" + priceIdx;
  }

  console.debug("jme modifySouthwestEntry end");
}


console.debug("jme end");
