/**
 * This file contains the implementation of both SidePanel and SidePanelSyncer.
 * We want these two objects to be able to access each other's functions without
 * having to pass messages. As fas as my current knowledge extends, the only way
 * to enable this is to put them in the same file.
 */

/*****************************************************************************
 **********************    Implementation of SidePanel   **********************
 *****************************************************************************/

//------------------------//
//        VARIABLES       //
//------------------------//
var sidePanel;   // the HTML div that is the side panel. Saved here to avoid getting it from the document each time it's needed.
var panelWidth;  // the width of the panel when open. Initialized according to the stored state.
var panelUndockedHeight; // the undocked height of the panel


//------------------------//
//         SCRIPT         //
//------------------------//

// read panel state
chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_SP_UNDOCKED", "WILLOW_SP_UNDOCKED_LOC",
    "WILLOW_SP_WIDTH", "WILLOW_SP_UD_HEIGHT","WILLOW_OPACITY_UPDATE","WILLOW_OPACITY", "WILLOW_LABEL_OPEN"], function (res) {
    panelWidth = res.WILLOW_SP_WIDTH;
    panelUndockedHeight = res.WILLOW_SP_UD_HEIGHT;
    // The panel is closed and docked by default. Update based on the stored state.
    if (res.WILLOW_SP_OPEN) {
        openSidePanel(false);
    }
    if (res.WILLOW_SP_UNDOCKED) {
        undockSidePanel(res.WILLOW_SP_UNDOCKED_LOC, false);
    }
    if (parseInt(panelWidth, 10) < 590)
        document.getElementById("willow-willowLabel").style.display = "none";
    if(res.WILLOW_OPACITY_UPDATE)
        updateOpacity(res.WILLOW_OPACITY);

    if (res.WILLOW_LABEL_OPEN){
        document.getElementById("willow-willowLabel").style.display = "";}
    else  {
        document.getElementById("willow-willowLabel").style.display = "none";}

});

// register event handlers;
document.getElementById("willow-newTabBtn").onclick     = () => openInNewTab(true);;
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


function toggleSidePanel(isOrigin) {
    if (sidePanel.style.width == panelWidth) {
        closeSidePanel(isOrigin);
    } else {
        openSidePanel(isOrigin);
    }
}

function updateOpacity(willowOpacity){
    document.getElementById("willow-graphFrame").style.opacity = willowOpacity.opacity;
}


function startNewSession(){
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_NEW_SESSION_CONFIRMATION"
    });
}

function disableDragging() {
    document.getElementById("willow-panelHeader").onmousedown = null;
}

function enableDragging() {
    var deltaX = 0, deltaY = 0, lastX = 0, lastY = 0;
    document.getElementById("willow-panelHeader").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        lastX = e.clientX;
        lastY = e.clientY;

        document.onmouseup = dragMouseUp;
        document.onmousemove = dragMouseMove;
    }

    function dragMouseMove(e) {
        e = e || window.event;
        e.preventDefault();

        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);

        // mousemove events may trigger out of the window (when the panel is dragged off-screen)
        // if clientX/clientY are out of the window, then elementFromPoint returns null
        if (!elemBelow) return;

        deltaX = e.clientX - lastX;
        deltaY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        sidePanel.style.top = (parseInt(sidePanel.style.top, 10) + deltaY) + "px";
        sidePanel.style.left = (parseInt(sidePanel.style.left, 10) + deltaX) + "px";
    }

    function dragMouseUp() {
        // end of drag. remove handlers.
        document.onmouseup = null;
        document.onmousemove = null;

        // save new undocked panel location
        chrome.storage.local.set({
            WILLOW_SP_UNDOCKED_LOC: {
                top: sidePanel.style.top,
                left: sidePanel.style.left
            }
        });
        // notify other tabs with a sync request
        chrome.runtime.sendMessage({
            message: "WILLOW_SP_SYNC_REQUEST",
            action: "WILLOW_SP_SYNC_DRAG",
            newPos: {
                top: sidePanel.style.top,
                left: sidePanel.style.left
            }
        });
    }
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
 *******************    Implementation of SidePanelSyncer   *******************
 *****************************************************************************/

// listen for sidePanel sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "WILLOW_SP_SYNC_REQUEST") {
            handleSPSyncRequest(request);
        }
        else if (request.message == "WILLOW_LABEL_SYNC_REQUEST"){
            handleWillowLabelSyncRequest(request);
        }
    }
);

function handleSPSyncRequest(request) {
    if (request.action == "WILLOW_SP_SYNC_OPEN") {
        openSidePanel(false);
    } else if (request.action == "WILLOW_SP_SYNC_CLOSE") {
        closeSidePanel(false);
    } else if (request.action == "WILLOW_SP_SYNC_TOGGLE") {
        toggleSidePanel(false);
    } else if (request.action == "WILLOW_SP_SYNC_UNDOCK") {
        undockSidePanel(null, false);
    } else if (request.action == "WILLOW_SP_SYNC_DOCK") {
        dockSidePanel(false);
    } else if (request.action == "WILLOW_SP_SYNC_DRAG") {
        sidePanel.style.top = request.newPos.top;
        sidePanel.style.left = request.newPos.left;
    } else if (request.action == "WILLOW_SP_SYNC_RESIZE") {
        sidePanel.style.width = request.newWidth;
        sidePanel.style.height = request.newHeight;
    }
}

function handleWillowLabelSyncRequest(request){

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

function labelOpenMessage(){

    chrome.storage.local.set({ WILLOW_LABEL_OPEN: true });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({
        message: "WILLOW_LABEL_SYNC_REQUEST",
        action: "WILLOW_LABEL_SYNC_OPEN" });
}

function labelCloseMessage(){

    chrome.storage.local.set({ WILLOW_LABEL_OPEN: false });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({
        message: "WILLOW_LABEL_SYNC_REQUEST",
        action: "WILLOW_LABEL_SYNC_CLOSE"});
}


/**
 * The low level design report includes the function sendSyncRequest() in SidePanelSyncer.
 * This function is currently ditched. There does not seem to be much to be abstracted.
 * SidePanel sends the requests directly.
 */
