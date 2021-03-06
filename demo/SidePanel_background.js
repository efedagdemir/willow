// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_SP_OPEN: false, 
        WILLOW_SP_UNDOCKED: false,  
        WILLOW_SP_UNDOCKED_LOC: null,
        WILLOW_SP_WIDTH: "400px" 
    });
});

// register browserAction listener (extension icon in the toolbar)
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("IN_onClicked");
    // set global state
    chrome.storage.local.set({ WILLOW_SP_OPEN: true });
    // notify tabs through the broadcaster
    broadcastSyncRequest({
        message: "WILLOW_SP_SYNC_REQUEST",
        action: "WILLOW_SP_SYNC_TOGGLE",
        notifyActiveTab: true
    });
});