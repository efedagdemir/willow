// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_VIEWPORT: {
            zoom: 1,
            pan: {x: 150, y:300}
        },
        WILLOW_NOTES_OPEN:{
            open: false,
            id: null
        }
    });
});