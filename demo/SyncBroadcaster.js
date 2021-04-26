// add a listener for sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // only broadcast SidePanel or Graph sync requests, do nothing when other messages are received
        if (   request.message == "WILLOW_SP_SYNC_REQUEST"
            /**
             * It seems we have messed up and most sync requests are
             * repeated. This is problematic for the following three so they
             * are commented out now.
             */
            // || request.message == "WILLOW_INFO_SYNC_REQUEST"
            // || request.message == "WILLOW_HOW_TO_SYNC_REQUEST"
            // || request.message == "WILLOW_HOW_TO_DETAILS_SYNC_REQUEST"
            || request.message == "WILLOW_RADIO_SYNC_REQUEST"
            || request.message == "WILLOW_GRAPH_SYNC_REQUEST" 
            || request.message == "WILLOW_VIEWPORT_SYNC_REQUEST"
            || request.message == "WILLOW_LABEL_SYNC_REQUEST") {
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
    let selector = {currentWindow: true};
    if (!request.notifyActiveTab) {
        selector.active = false;
    } else if (request.notifyActiveTab == "exclusively") {
        selector.active = true;
    }
    chrome.tabs.query(selector, function(tabs) {
        console.log("----------------: ", tabs.length);
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, request);
        }    
    });
}