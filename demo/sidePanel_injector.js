/**
 * CONSANTS - To be moved to a unified place later on
 */

var PANEL_WIDTH = "400px";
var HEADER_HEIGHT = "70px";
var ICON_WIDTH = "70px";
var ICON_HEIGHT = "70px";

/**
 * VARIABLES
 */
var panelFrame  // the iframe which will contain the side panel

/**
 * SCRIPT
 */
injectPanelFrame();
injectDragMask();
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command == "open") {
      panelFrame.style.height = "100%"
      panelFrame.style.width = PANEL_WIDTH;
      chrome.storage.local.set({ WILLOW_SP_OPEN: true });
    } else if (request.command == "close") {
      panelFrame.style.width = ICON_WIDTH;
      panelFrame.style.height = ICON_HEIGHT;
      chrome.storage.local.set({ WILLOW_SP_OPEN: false });
    } else if (request.command == "undock") {
      panelFrame.style.height = "86%";
      panelFrame.style.top = "2%";
      panelFrame.style.left = "15px";
      enableDragging();
    }
  }
);

/**
 * FUNCTIONS
 */
function enableDragging() {

}


// Create, style and insert panelFrame
function injectPanelFrame() {
  panelFrame  = document.createElement ('iframe');
  panelFrame.src  = chrome.runtime.getURL('side_panel.html');  // may move this down.
  panelFrame.style.position = 'fixed';
  panelFrame.style.top='0%';
  panelFrame.style.left='0%';
  panelFrame.style.border="0";
  chrome.storage.local.get("WILLOW_SP_OPEN", function (res) {
    if (res.WILLOW_SP_OPEN) {
      panelFrame.style.width = PANEL_WIDTH;
      panelFrame.style.height = "100%";
    } else {
      panelFrame.style.width = ICON_WIDTH;
      panelFrame.style.height = ICON_HEIGHT;
    }
  });
  document.body.zIndex = -1;
  panelFrame.style.zIndex = 1000; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  document.body.append(panelFrame);
}

function injectDragMask() {
  var dragMask = document.createElement("div");
  dragMask.style.position = 'fixed';
  dragMask.style.top = panelFrame.style.top;
  dragMask.style.left = panelFrame.style.left;
  dragMask.style.width = PANEL_WIDTH;
  dragMask.style.height = HEADER_HEIGHT;
  dragMask.style.backgroundColor = "blue";
  dragMask.style.visibility = "visible";
  dragMask.style.zIndex = 1001; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  document.body.append(dragMask);
  alert("maskInjected");
}