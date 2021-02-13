// initalize stored state
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({  
        WILLOW_SP_OPEN: false, 
        WILLOW_SP_UNDOCKED: false,  
        WILLOW_SP_UNDOCKED_LOC: null,
        WILLOW_SP_WIDTH: "400px" 
    });
});

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
    chrome.tabs.query({active: false, currentWindow: true}, function(tabs) {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, request);
        }    
    });
}