/**
 *Initialize locally stored data in chrome
 */
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        WILLOW_SP_OPEN: false,
        WILLOW_WINDOW_OPEN: false,
        WILLOW_TAB_ID: -1,
        WILLOW_SP_UNDOCKED: false,
        WILLOW_SP_UNDOCKED_LOC: null,
        WILLOW_SP_WIDTH: "700px",
        WILLOW_SP_UD_HEIGHT: "600px",
        WILLOW_CRAWLER_OPEN: false,
        WILLOW_SPINNER_OPEN: false,

        WILLOW_LABEL_OPEN: true,
        WILLOW_OPACITY_UPDATE: false,
        WILLOW_OPACITY: null,
        WILLOW_SETTINGS_OPEN: false,
        WILLOW_INFO_OPEN: false,
        WILLOW_HOW_TO_OPEN: false,
        WILLOW_LAYOUT_OPT: 1,
        WILLOW_DETAILS_TAGS: '0000000' //a basic way of showing which details are opened, used only for initialization
    });
});
//--------------------------------//
//        Global variables        //
//--------------------------------//
let curTabID = 0;
let prevTabId = 0;
let createdTabId  = 0;
let preWindowID = 0;
let currentWindowID = 0;
let prev = 0;
let openSidePanel = false;
let dedicatedTabOpen = false;


//--------------------------------//
//   Events and event handlers    //
//--------------------------------//
/**
 * This is to keep track of last seen tab so we can redirect to it when
 * dedicated tab is closed
 */

chrome.tabs.onSelectionChanged.addListener( (tabId, selectInfo) => {
    setTimeout(() => {
    prevTabId = curTabID;
    curTabID = tabId;
   // alert(prevTabId);
    chrome.windows.getCurrent(function(win)
    {
        preWindowID = currentWindowID;
        currentWindowID = win.id;
    });
    }, 500);
});




/**
 * This is to open willow in dedicated tab when icon is clicked in chrome
 * or to direct to the dedicated tab if it is already open
 */
chrome.browserAction.onClicked.addListener(  function (tab)
{
    let action = "WILLOW_SP_SYNC_TOGGLE";
    // read and toggle global panel state
    chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_WINDOW_OPEN"], function (res) {
        if (!res.WILLOW_WINDOW_OPEN && !res.WILLOW_SP_OPEN) { //when opening willow by default
            chrome.storage.local.set({WILLOW_WINDOW_OPEN: true});
                chrome.tabs.create({
                    active: true,
                    url: 'NewTab/newTab.html'
                }, function (tab) {
                    createdTabId = tab.id;
                    chrome.storage.local.set({WILLOW_TAB_ID: createdTabId});
                    dedicatedTabOpen = true;
                });

        }
        else if (res.WILLOW_WINDOW_OPEN) { //When dedicated tab is already open
            chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
                chrome.tabs.update(res.WILLOW_TAB_ID, {selected: true});
            });
        }
        else if (res.WILLOW_SP_OPEN ) //Open side panel is open
        {
            chrome.storage.local.set({ WILLOW_SP_OPEN: true});
            action = "WILLOW_WINDOW_TO_SP";
        }

        broadcastSyncRequest({
            message: "WILLOW_SP_SYNC_REQUEST",
            action: action,
            notifyActiveTab: true
        });

    });
});


/**
 * This is to open willow in dedicated tab when icon is clicked in side panel
 * and open side panel in last seen tab when icon is clicked in dedicated tab
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'WILLOW_SYNC_OPEN_NEW_TAB') {
        chrome.tabs.create({
            active: true,
            url: 'NewTab/newTab.html'
        }, function (tab) {
            createdTabId = tab.id;
            chrome.storage.local.set({WILLOW_TAB_ID: createdTabId});
        });
    } else if (request.message === 'WILLOW_SHOW_AS_SIDE_PANEL') {
        prev = prevTabId;
        openSidePanel = true;
        chrome.windows.update(preWindowID, {focused: true}, (window) => {
            chrome.tabs.update(prevTabId, {active: true})
        })
        //chrome.tabs.update(prevTabId, {selected: true});
        chrome.storage.local.get(["WILLOW_TAB_ID"], function (res) {
            chrome.tabs.remove(res.WILLOW_TAB_ID);
        });
        chrome.storage.local.set({ WILLOW_SP_OPEN: true });
        setTimeout(() => {
            broadcastSyncRequest2( {
                message: "WILLOW_SP_SYNC_REQUEST",
                action: "WILLOW_WINDOW_TO_SP",
                prevId: prev
            });  }, 150);

    }
    return true;
});

/**
 * When dedicated tab for willow is closed change locally stored parameters
 */
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    chrome.storage.local.get(["WILLOW_TAB_ID"], async function (res) {
        if( res.WILLOW_TAB_ID === tabid )
        {
           await chrome.storage.local.set({WILLOW_WINDOW_OPEN: false});
           await chrome.storage.local.set({WILLOW_SP_OPEN: openSidePanel});
        }
        openSidePanel = false;
    });
});
