'use strict';

//* Burayı ben yazdım (Cem)
chrome.runtime.onInstalled.addListener( function(){
    chrome.storage.local.set({visitedPages: []})
})

chrome.history.onVisited.addListener(function (result) {
    chrome.storage.sync.set({url: result.url}, function() {
        console.log("SET: " + result.url);
    });

    //* Burayı da
    chrome.storage.local.get("visitedPages", function(res) {
        console.log("yelo");
        console.log(res.visitedPages);
        res.visitedPages.push(result.url);
        chrome.storage.local.set({visitedPages: res.visitedPages});
    })
});