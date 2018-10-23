// ==UserScript==
// @name        google_flights_fiddle
// @namespace   JacobEgner
// @version     0.0
// @description for fiddling with Project01_GoogleFlights
// @license     CC0-1.0
// @match       https://www.google.com/flights*
// @run-at document-idle
// ==/UserScript==

console.log("jme begin");


function checkForResults(changes, observer)
{
  //console.log("jme checkForResults begin");
  var dominatedList = document.querySelector('ol.gws-flights-results__has-dominated');

  if(dominatedList)
  {
    observer.disconnect();
    modifySouthwestEntries(dominatedList);
  }

  //console.log("jme checkForResults end")
}


function modifySouthwestEntries(dominatedList)
{
  console.log("jme modifySouthwestEntries begin");

  var southwestFlightXPathResult = document.evaluate(
    ".//li[contains(@class, 'gws-flights-results__result-item') and contains(.//span, 'Southwest')]",
    dominatedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  console.log("jme found " + southwestFlightXPathResult.snapshotLength + " flights");

  for(var snapshotIdx = 0; snapshotIdx < southwestFlightXPathResult.snapshotLength; snapshotIdx++)
  {
    var southwestFlightListItem = southwestFlightXPathResult.snapshotItem(snapshotIdx);
    modifySouthwestEntry(southwestFlightListItem);
  }

  console.log("jme modifySouthwestEntries end");
}


function modifySouthwestEntry(flightListItem)
{
  console.log("jme modifySouthwestEntry begin");
  console.log(flightListItem);

  var priceXpathResult = document.evaluate(
    ".//jsl[text()='Price unavailable']",
    flightListItem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for(var priceIdx = 0; priceIdx < priceXpathResult.snapshotLength; priceIdx++)
  {
    var priceNode = priceXpathResult.snapshotItem(priceIdx);
    priceNode.innerText = "PRICE_GOES_HERE";
  }

  console.log("jme modifySouthwestEntry end");
}


(new MutationObserver(checkForResults)).observe(
  document,
  {childList: true, subtree: true});

console.log("jme end");
