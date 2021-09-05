// add a listener for sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // only broadcast SidePanel or Graph sync requests, do nothing when other messages are received
        if (   request.message === "WILLOW_SP_SYNC_REQUEST"
            /**
             * It seems we have messed up and most sync requests are
             * repeated. This is problematic for the following three so they
             * are commented out now.
             */
            // ||request.message == "WILLOW_INFO_SYNC_REQUEST"
            // ||request.message == "WILLOW_HOW_TO_SYNC_REQUEST"
            // || request.message == "WILLOW_HOW_TO_DETAILS_SYNC_REQUEST"
            || request.message === "WILLOW_RADIO_SYNC_REQUEST"
            || request.message === "WILLOW_GRAPH_SYNC_REQUEST"
            || request.message === "WILLOW_VIEWPORT_SYNC_REQUEST"
            || request.message === "WILLOW_LABEL_SYNC_REQUEST") {
            broadcastSyncRequest(request);
        }
    }
);

// broadcast received message to the inactive tabs in the current window.
function broadcastSyncRequest(request) {
    /**
     * notifyActiveTab is a quick fix to handle some exceptional cases.
     * By default, the active tab is not notified
     */

    chrome.storage.local.set({WILLOW_SP_WIDTH: "750px"});
    chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
            window.tabs.forEach(function(tab){
                chrome.tabs.sendMessage(tab.id, request);
            });
        });
    });

}

/**
 * Notify last seen tab to open side panel
 */
function broadcastSyncRequest2(request) {
    chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
            window.tabs.forEach( async function(tab)
            {
                if (tab.id === request.prevId) //Send only to last seen tab
                {
                   await chrome.tabs.sendMessage(tab.id, request);
                }
            });
        });
    });
}
