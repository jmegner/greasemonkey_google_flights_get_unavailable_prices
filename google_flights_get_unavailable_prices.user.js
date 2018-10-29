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

console.debug("jme main begin");

(new MutationObserver(checkForInitialResults)).observe(
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
/*
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

function getDominatedList()
{
  return document.querySelector("ol.gws-flights-results__has-dominated");
}

function checkForInitialResults(changes, observer)
{
  //console.debug("jme checkForInitialResults begin");
  var dominatedList = getDominatedList();

  if(dominatedList)
  {
    observer.disconnect();
    
    var divForFuturemonitoring = dominatedList.parentElement.parentElement;
    (new MutationObserver(checkForModifiedResults)).observe(
      divForFuturemonitoring,
      {childList: true, subtree: false});
    
    console.debug("jme relevant mutation list");
    console.debug(changes);
    modifySouthwestEntries(dominatedList);
  }

  //console.debug("jme checkForInitialResults end")
}

function checkForModifiedResults(changes, observer)
{
  console.debug("jme checkForModifiedResults begin");
  //console.debug(changes);
  
  for(var changeIdx = 0; changeIdx < changes.length; changeIdx++)
  {
    var change = changes[changeIdx];    
    console.debug(change);
    
    if(change.addedNodes)
    {
      var dominatedList = getDominatedList();
      if(dominatedList)
      {
        modifySouthwestEntries(dominatedList);
      }
      break;
    }
  }
  console.debug("jme checkForModifiedResults end")
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
  
  var flightIdSpan = flightListItem.querySelector("div.gws-flights-results__aircraft-type ~ span > span:last-child");
  
  if(!flightIdSpan)
  {
    console.error("jme could not find flight id span");
    console.error(flightListItem);
  }
  
  console.debug("jme flight id = " + flightIdSpan.innerText);
  
  console.debug("jme modifySouthwestEntry end");
}


console.debug("jme main end");
