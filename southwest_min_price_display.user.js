// ==UserScript==
// @name        southwest_min_price_display
// @namespace   https://github.com/jmegner
// @version     0.1
// @match       https://www.southwest.com/air/booking/select.html?*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

"use strict";
console.debug("jme southwest_fiddle main begin");

startCancellableInterval(makeLogWrappedCallback(lookForMinRoundTripPrice), 1000);
//logDocMutations();


///////////////////////////////////////////////////////////////////////////////////

function lookForMinRoundTripPrice(timerId)
{
  var departingFlightList = document.querySelector("#air-booking-product-0 .transition-content ul");
  var returningFlightList = document.querySelector("#air-booking-product-1 .transition-content ul");
  
  if(departingFlightList === null || returningFlightList === null)
  {
    return;
  }  

  var minPriceDepartingFlight = getMinFlightPrice(departingFlightList);
  var minPriceReturningFlight = returningFlightList ? getMinFlightPrice(returningFlightList) : 0;  
  var minRoundTripPrice = minPriceDepartingFlight + minPriceReturningFlight;
  
  if(minRoundTripPrice >= 9e9)
  {
    return;
  }
  
  clearInterval(timerId);
  
  var minPriceMsg = "Best $" + minRoundTripPrice
    + " = $" + minPriceDepartingFlight + " + $" + minPriceReturningFlight;
  
  var minPriceDiv = document.createElement("div");
  minPriceDiv.setAttribute("style", "font-size:x-large");
  minPriceDiv.innerText = minPriceMsg;
  
  var someDiv = document.querySelector("div.header-booking--container.container.container_standard");
  someDiv.appendChild(minPriceDiv);
}

function getMinFlightPrice(flightList)
{
  var minPrice = 9e9;
  
  for(var flightItem of flightList.children)
  {
    console.debug(flightItem);
    var priceSpans = flightItem.querySelectorAll("span.fare-button--value-total");
    var prices = Array.from(priceSpans).map(span => parseFloat(span.innerText));    
    minPrice = Math.min(minPrice, ...prices);
    console.debug("minPrice=" + minPrice, prices);
  }
  
  return minPrice;
}


/////////////////////////////////////////////////////////////////////////////////

function execLogWrappedFunc(funcToWrap, ...funcArgs)
{
  try
  {
    return funcToWrap(...funcArgs);
  }
  catch(err)
  {
    console.error(err);
    throw err;
  }
}

function makeLogWrappedCallback(funcToWrap)
{
  return function(...funcArgs) { return execLogWrappedFunc(funcToWrap, ...funcArgs); };
}

function logDocMutations()
{  
  (new MutationObserver(makeLogWrappedCallback( changes => console.debug(changes) ))).observe(
    document,
    {childList: true, subtree: true});
}

function startCancellableInterval(periodicFunc, intervalMs)
{
  var wrappedPeriodicFunc = () => execLogWrappedFunc(periodicFunc, timerId);
  var timerId = setInterval(wrappedPeriodicFunc, intervalMs);
}


