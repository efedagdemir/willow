// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_SP_OPEN: false,
        WILLOW_WINDOW_OPEN: false,
        WILLOW_TAB_ID: -1,
        WILLOW_SP_UNDOCKED: false,  
        WILLOW_SP_UNDOCKED_LOC: null,
        WILLOW_SP_WIDTH: "700px",
        WILLOW_SP_UD_HEIGHT: "600px",

        WILLOW_LABEL_OPEN: true,
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
    var bool = false;
    chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_WINDOW_OPEN"], function (res) {
        if( res.WILLOW_WINDOW_OPEN )
        {
            chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
                chrome.tabs.update(res.WILLOW_TAB_ID, {selected: true});
            });
        }
        else
        {
            if (res.WILLOW_SP_OPEN ) {
                chrome.storage.local.set({ WILLOW_SP_OPEN: false});
            } else {
                chrome.storage.local.set({ WILLOW_SP_OPEN: true});
            }
            bool = true;
        }
    });
   
    // notify tabs through the broadcaster
    setTimeout(() => {
        if(bool) {
            broadcastSyncRequest({
                message: "WILLOW_SP_SYNC_REQUEST",
                action: "WILLOW_SP_SYNC_TOGGLE",
                notifyActiveTab: true
            });
        }
    }, 150);

});

//Listen if new tab button is clicked
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'WILLOW_SYNC_OPEN_NEW_TAB') {
        chrome.tabs.create({
            active: true,
            url: 'NewTab/newTab.html'
        }, function(tab){
            createdTabId = tab.id;
            chrome.storage.local.set({ WILLOW_TAB_ID: createdTabId });
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
        if( res.WILLOW_TAB_ID == tabid )
        {
            chrome.storage.local.set({ WILLOW_WINDOW_OPEN: false })
        }
    });
});