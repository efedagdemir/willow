chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({visitedPages: []});

    chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab){
            if(changeInfo.url != undefined) {
                console.log(changeInfo.url);
                chrome.storage.local.get("visitedPages", function(res) {
                    console.log("yelo");
                    console.log(res.visitedPages);
                    res.visitedPages.push(changeInfo.url);
                    chrome.storage.local.set({visitedPages: res.visitedPages});
                })
            }
    });
});