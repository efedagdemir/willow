/**
 * This file contains the implementation of both NewTab and NewTabSyncer.
 */

/*****************************************************************************
 **********************    Implementation of NewTab   **********************
 *****************************************************************************/

//------------------------//
//        VARIABLES       //
//------------------------//
var sidePanel;   // the HTML div that is the side panel. Saved here to avoid getting it from the document each time it's needed.


//------------------------//
//         SCRIPT         //
//------------------------//

// read panel state
chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_SP_UNDOCKED", "WILLOW_SP_UNDOCKED_LOC",
    "WILLOW_SP_WIDTH", "WILLOW_SP_UD_HEIGHT","WILLOW_OPACITY_UPDATE","WILLOW_OPACITY", "WILLOW_LABEL_OPEN"], function (res) {
    // The panel is closed and docked by default. Update based on the stored state.
    if(res.WILLOW_OPACITY_UPDATE)
        updateOpacity(res.WILLOW_OPACITY);

    if (res.WILLOW_LABEL_OPEN){
        document.getElementById("willow-willowLabel").style.display = "";}
    else  {
        document.getElementById("willow-willowLabel").style.display = "none";}

});
chrome.storage.local.set({ WILLOW_SP_OPEN: true });

// register event handlers;
document.getElementById("willow-newBtn").onclick       = () => startNewSession();
document.getElementById("willow-layoutBtn").onclick    = () => runLayoutBtn_handler();
document.getElementById("willow-settingsBtn").onclick  = () => toggleSettingsMenu();

// -- end of script


//------------------------//
//       FUNCTIONS        //
//------------------------//

// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

/**
 * isOrigin indicates whether this page has originated the opening event.
 * It is true if openSidePanel called in reaction to a user action and
 * false if it is reacting to async request.
 */


function updateOpacity(willowOpacity){
    document.getElementById("willow-graphFrame").style.opacity = willowOpacity.opacity;
}


function startNewSession(){
    alert("here");
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_NEW_SESSION_CONFIRMATION"
    });
}

function toggleSettingsMenu() {

    chrome.storage.local.get(["WILLOW_HOW_TO_OPEN", "WILLOW_INFO_OPEN"], function (res) {
        if (res.WILLOW_INFO_OPEN){
            chrome.storage.local.set({ WILLOW_INFO_OPEN: false });
            // notify other tabs with a sync request
            chrome.runtime.sendMessage({
                message: "WILLOW_INFO_SYNC_REQUEST",
                action: "WILLOW_INFO_SYNC_CLOSE",
            });
        }
        else if (res.WILLOW_HOW_TO_OPEN) {
            chrome.storage.local.set({ WILLOW_HOW_TO_OPEN: false });
            // notify other tabs with a sync request
            chrome.runtime.sendMessage({
                message: "WILLOW_HOW_TO_SYNC_REQUEST",
                action: "WILLOW_HOW_TO_SYNC_CLOSE",
            });
        }
    });

    // initialize the menu's open/closee state
    chrome.storage.local.get(["WILLOW_SETTINGS_OPEN"], function (res) {
        if (res.WILLOW_SETTINGS_OPEN) {
            // set global state
            chrome.storage.local.set({ WILLOW_SETTINGS_OPEN: false });
            // broadcast
            chrome.runtime.sendMessage({
                message: "WILLOW_SETTINGS_SYNC_REQUEST",
                action: "WILLOW_SETTINGS_SYNC_CLOSE"
            });
        } else {
            // set global state
            chrome.storage.local.set({ WILLOW_SETTINGS_OPEN: true });
            // broadcast
            chrome.runtime.sendMessage({
                message: "WILLOW_SETTINGS_SYNC_REQUEST",
                action: "WILLOW_SETTINGS_SYNC_OPEN",
            });
        }

    });
}

function runLayoutBtn_handler() {
    chrome.storage.local.get(["WILLOW_LAYOUT_OPT"], function (res) {
        if (res.WILLOW_LAYOUT_OPT == 1){
            chrome.runtime.sendMessage({ //test
                message: "WILLOW_BACKGROUND_RUN_LAYOUT",
                option: "incremental"
            });
        }
        else{
            chrome.runtime.sendMessage({
                message: "WILLOW_BACKGROUND_RUN_LAYOUT",
                option: "recalculate"
            });
        }
    });
}

/*****************************************************************************
 *******************    Implementation of NewTabSyncer   *******************
 *****************************************************************************/

// listen for newtab sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "WILLOW_SP_SYNC_REQUEST") {
            handleTabSyncRequest(request);
        }
        else if (request.message == "WILLOW_LABEL_SYNC_REQUEST"){
            handleWillowLabelSyncRequestWINDOW(request);
        }
    }
);

function handleTabSyncRequest(request) {
     if (request.action == "WILLOW_SP_SYNC_DRAG") {
        sidePanel.style.top = request.newPos.top;
        sidePanel.style.left = request.newPos.left;
    } else if (request.action == "WILLOW_SP_SYNC_RESIZE") {
        sidePanel.style.width = request.newWidth;
        sidePanel.style.height = request.newHeight;
    }
}

function handleWillowLabelSyncRequestWINDOW(request){

    if (request.action == "WILLOW_LABEL_SYNC_OPEN") {

        label = document.getElementById("willow-willowLabel");
        if (label.classList.contains("shrinkTrans") && label.classList.contains("willow-anim")) {
            label.classList.remove("willow-anim");
            label.classList.remove("shrinkTrans");
        }

        document.getElementById("willow-willowLabel").style.display = "";

    } else if (request.action == "WILLOW_LABEL_SYNC_CLOSE") {
        document.getElementById("willow-willowLabel").style.display = "none";
    }

}








