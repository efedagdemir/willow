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

var prevId = 0;
// register browserAction listener (extension icon in the toolbar)
chrome.browserAction.onClicked.addListener(function(tab) {
    // read and toggle global panel state

    var bool = false;
    chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_WINDOW_OPEN"], function (res) {
        if( !res.WILLOW_WINDOW_OPEN &&  !res.WILLOW_WINDOW_OPEN  ) {
            chrome.storage.local.set({WILLOW_WINDOW_OPEN: true});
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                //console.log("----------------: ", tabs.length);
                for (let tab of tabs) {
                  //  alert(tab.id);
                    prevId = tab.id;
                }


                } );
            setTimeout(() => {
            chrome.tabs.create({
                active: true,
                url: 'NewTab/newTab.html'
            }, function (tab) {
                createdTabId = tab.id;
                chrome.storage.local.set({WILLOW_TAB_ID: createdTabId});
            });
            }, 150);
        }
        if( res.WILLOW_WINDOW_OPEN )
        {
            chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
                chrome.tabs.update(res.WILLOW_TAB_ID, {selected: true});
            });
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

var curTabID = 0;
var prevTabId = 0;

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    prevTabId = curTabID
    curTabID = tabId;
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

    else if( request.message == 'WILLOW_SHOW_AS_SIDE_PANEL') {
        chrome.storage.local.set({WILLOW_WINDOW_OPEN: false})
        chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
            chrome.tabs.remove(res.WILLOW_TAB_ID);
        });

        chrome.storage.local.get(["WILLOW_WINDOW_OPEN"], function (res) {
        //    alert(res.WILLOW_WINDOW_OPEN + " is it still open");
        });

        chrome.tabs.update(prevId, {selected: true});

       // sendMessageToOpenSidePanel( prevTabID, request);
                broadcastSyncRequest({
                    message: "WILLOW_SP_SYNC_REQUEST",
                    action: "WILLOW_SP_SYNC_TOGGLE",
                    notifyActiveTab: true
                });



    }
    return true;
});

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
        if( res.WILLOW_TAB_ID == tabid )
        {
            chrome.storage.local.set({ WILLOW_WINDOW_OPEN: false });
            chrome.storage.local.set({ WILLOW_SP_OPEN: true });
            chrome.storage.local.set({ WILLOW_SP_WIDTH: "700px" });
            chrome.tabs.update(0, {selected: true});
        }
    });
});