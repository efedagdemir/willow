// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_SP_OPEN: false, 
        WILLOW_SP_UNDOCKED: false,  
        WILLOW_SP_UNDOCKED_LOC: null,
        WILLOW_SP_WIDTH: "700px",
        WILLOW_SP_UD_HEIGHT: "600px",
        WILLOW_OPACITY_UPDATE:false,
        WILLOW_OPACITY:null,
        WILLOW_SETTINGS_OPEN: false,
        WILLOW_INFO_OPEN: false,
        WILLOW_HOW_TO_OPEN: false,
        WILLOW_LAYOUT_OPT: 1,
        WILLOW_DETAILS_TAGS: '0000000' //a basic way of showing which details are opened, used only for initialization
    });
});

// register browserAction listener (extension icon in the toolbar)
chrome.browserAction.onClicked.addListener(function(tab) {
    // read and toggle global panel state
    chrome.storage.local.get(["WILLOW_SP_OPEN"], function (res) {
        if (res.WILLOW_SP_OPEN) {
            chrome.storage.local.set({ WILLOW_SP_OPEN: false});
        } else {
            chrome.storage.local.set({ WILLOW_SP_OPEN: true});
        }
    });
   
    // notify tabs through the broadcaster
    broadcastSyncRequest({
        message: "WILLOW_SP_SYNC_REQUEST",
        action: "WILLOW_SP_SYNC_TOGGLE",
        notifyActiveTab: true
    });
});