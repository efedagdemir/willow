/**
 * ------------ CONSANTS - To be moved to a unified place later on
 */
var PANEL_WIDTH = "400px";
var HEADER_HEIGHT = "70px";
var ICON_WIDTH = "70px";
var ICON_HEIGHT = "70px";

/**
 * ------------ SCRIPT
 */

// determine initial panel width    (might be able to remove this by setting overflow-x in parent iframe)
chrome.storage.local.get("WILLOW_SP_OPEN", function (res) {
  if (res.WILLOW_SP_OPEN) {
    let sidePanel = document.getElementById("sidePanel");
    // Trying to disable transition animation. Does not work right now.
    let tmp = sidePanel.style.transition;
    sidePanel.style.transition = "0s";
    document.getElementById("sidePanel").style.width = PANEL_WIDTH;
    sidePanel.style.transition = tmp;
  } else {
    document.getElementById("sidePanel").style.width = 0;
  }
});

// register event handlers
document.getElementById("openBtn").onclick = openSidePanel;
document.getElementById("closeBtn").onclick = closeSidePanel;
document.getElementById("undockBtn").onclick = undockSidePanel;

/**
 * ------------ FUNCTIONS
 */

// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

function openSidePanel() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "open"});
    });
    document.getElementById("sidePanel").style.width = PANEL_WIDTH;
}

/* Set the width of the sidebar to 0 (hide it) */
function closeSidePanel() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "close"});
    }); 
    document.getElementById("sidePanel").style.width = "0px";
} 
/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command == "get_drag_zone") {
      sendResponse({
        // send the area corresponding to drag zone so that the content script can insert an invisible mask
        // there probably is a trivial shortcut to passing all required dimensions
        dragZone: {
          top: dragZone.style.top,
          left: dragZone.style.left, 
          height: dragZone.style.height,
          width: dragZone.style.width
        } 
      })
    }
  }
);
*/



// ----------------------------------- //
// Undocking and dragging              //
// ----------------------------------- //
function undockSidePanel() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "undock"});
    }); 
}
