// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_VIEWPORT: {
            zoom: 1,
            pan: {x: 200, y:300}
        }
    });
});