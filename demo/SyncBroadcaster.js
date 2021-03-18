// add a listener for sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // only broadcast SidePanel or Graph sync requests, do nothing when other messages are received
        if (request.message == "WILLOW_SP_SYNC_REQUEST"
            || request.message == "WILLOW_GRAPH_SYNC_REQUEST") {
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
        console.log("DONT NOTIFY ACTIVE TAB");
    }
    chrome.tabs.query(selector, function(tabs) {
        console.log("Query returned");
        for (let tab of tabs) {
            console.log("Sending message");
            chrome.tabs.sendMessage(tab.id, request);
        }    
    });
}