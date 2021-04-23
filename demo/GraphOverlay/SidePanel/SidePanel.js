/**
 * This file contains the implementation of both SidePanel and SidePanelSyncer.
 * We want these two objects to be able to access each other's functions without 
 * having to pass messages. As fas as my current knowledge extends, the only way
 * to enable this is to put them in the same file.
 */

/*****************************************************************************
**********************    Implementation of SidePanel   ********************** 
*****************************************************************************/

//-------------------------//
//        CONSTANTS        //
//-------------------------//
var UNDOCK_DEFAULT_OFFSET_TOP = "10px";
var UNDOCK_DEFAULT_OFFSET_LEFT = "10px";

var RESIZE_MIN_WIDTH = 350;  // in px
var RESIZE_MIN_HEIGHT = 350;  // in px

var sidePanelHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/side_panel.css")}">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
  
  <script src="cytoscape.min.js"></script>
  <script src="node_modules/dagre/dist/dagre.min.js"></script>
  <script src="node_modules/cytoscape-dagre/cytoscape-dagre.js"></script>
</head>

<body>
<div id="sidePanel">
  <div id="panelHeader">
  
    <img id="willowIcon" src="${chrome.extension.getURL("../../images/willowIcon_50x50.png")}" alt="Willow">
    <a class="willow-label" id="willowLabel" style="display:;">W I L L O W</a>
    
    <button title="Close"         class="headerBtn btn-close"     id="closeBtn"                                </button>
    <button title="Dock"          class="headerBtn btn-dock"      id="dockBtn"      style="display:none;"      </button>
    <button title="Undock"        class="headerBtn btn-undock"    id="undockBtn"                               </button>
    <button title="Settings"      class="headerBtn btn-settings"  id="settingsBtn"                             </button>
    <button title="Reset Graph"   class="headerBtn btn-reset"     id="resetBtn"                                </button>
    <button title="Center Graph"  class="headerBtn btn-center"    id="centerBtn"                               </button>
    
  </div>
  <div id="panelBody">
    <iframe id="graphFrame" src="${chrome.runtime.getURL("GraphOverlay/Graph/GraphDrawer.html")}"></iframe>
    <div id="graphInvisLayer"></div>
  </div>
  <div class="border" id="leftBorder"></div>
  <div class="border" id="rightBorder"></div>
  <div class="border" id="topBorder"></div>
  <div class="border" id="bottomBorder"></div>
</div>
</body>
</html>
`

// end of constants


//------------------------//
//        VARIABLES       //
//------------------------//
var sidePanel;   // the HTML div that is the side panel. Saved here to avoid getting it from the document each time it's needed.
var panelWidth;  // the width of the panel when open. Initialized according to the stored state.
var panelUndockedHeight; // the undocked height of the panel


//------------------------//
//         SCRIPT         //
//------------------------//
injectSidePanel();

// read panel state
chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_SP_UNDOCKED", "WILLOW_SP_UNDOCKED_LOC", 
  "WILLOW_SP_WIDTH", "WILLOW_SP_UD_HEIGHT"], function (res) {
  panelWidth = res.WILLOW_SP_WIDTH;
  panelUndockedHeight = res.WILLOW_SP_UD_HEIGHT;
  // The panel is closed and docked by default. Update based on the stored state.
  if (res.WILLOW_SP_OPEN) {
    openSidePanel(false);
  }
  if (res.WILLOW_SP_UNDOCKED) {
    undockSidePanel(res.WILLOW_SP_UNDOCKED_LOC, false);
  }
  if (panelWidth < 700)
    document.getElementById("willowLabel").style.display = "none";
    
});

// register event handlers
document.getElementById("closeBtn").onclick   = () => closeSidePanel(true);
document.getElementById("undockBtn").onclick  = () => undockSidePanel(null, true);
document.getElementById("dockBtn").onclick    = () => dockSidePanel(true);
document.getElementById("resetBtn").onclick   = () => {chrome.runtime.sendMessage({message: "WILLOW_BACKGROUND_CLEAR_SESSION"})};
document.getElementById("centerBtn").onclick   = () => {chrome.runtime.sendMessage({message: "WILLOW_GRAPH_VIEWPORT_CENTER"})};
document.getElementById("settingsBtn").onclick = () => openSettingsMenu(true);  // defined in SettingMenu.js
enableResizing(rightBorderOnly = true);

// -- end of script


//------------------------//
//       FUNCTIONS        //
//------------------------//

// Create and insert sidePanel
function injectSidePanel() {
  var panelWrapper = document.createElement('div');
  panelWrapper.id = "willowPanelWrapper";
  panelWrapper.innerHTML = sidePanelHTML;
  document.body.append(panelWrapper); // TODO: consider removing panelWrapper and inserting sidePanel only.

  // save sidePanel
  sidePanel = document.getElementById("sidePanel");

  document.body.zIndex = -1;
  sidePanel.style.zIndex = 2147483647; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  //document.body.append(sidePanel); // part of upper TODO
}

// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

/**
 * isOrigin indicates whether this page has originated the opening event.
 * It is true if openSidePanel called in reaction to a user action and
 * false if it is reacting to async request.
 */ 
function openSidePanel(isOrigin) {
  /*
  if (isOrigin) {
    sidePanel.style.transition = "all 0.5s";
  } else {
    sidePanel.style.transition = "all 0s";
  } */

  sidePanel.style.width = panelWidth;

  if (isOrigin) {
    // set global state
    chrome.storage.local.set({ WILLOW_SP_OPEN: true });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_OPEN",
    });
  }

  // TODO: When to do this? Surely not everytime a page is loaded.
  /**
  // the graph needs to re-adjust its viewport after the panel is opened.
  // ! A timeout is used temporarily to ensure that the iframe is resized before adjusting the viewport.
  setTimeout(() => {
    chrome.runtime.sendMessage({
      message: "WILLOW_GRAPH_VIEWPORT_CENTER",
    })
  }, 150);
  */

}

/**
 * isOrigin has the meaning identical to that in openSidePanel
 */ 
function closeSidePanel(isOrigin) {
  /*
  if (isOrigin) {
    sidePanel.style.transition = "all 0.5s";
  } else {
    sidePanel.style.transition = "all 0s";
  }*/

  sidePanel.style.width = "0px";
  
  if (isOrigin) {
    // set global state
    chrome.storage.local.set({ WILLOW_SP_OPEN: false });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_CLOSE",
    });
  }
}

function toggleSidePanel(isOrigin) {
  if (sidePanel.style.width == panelWidth) {
    closeSidePanel(isOrigin);
  } else {
    openSidePanel(isOrigin);
  }
}

function undockSidePanel(undockedLoc, isOrigin) {
  //sidePanel.style.transition = "all 0s";

  if (!(undockedLoc && undockedLoc.left && undockedLoc.top)) { // if called without proper input (sometimes intentionally)
    // "pop" the panel 
    sidePanel.style.top   = UNDOCK_DEFAULT_OFFSET_TOP;
    sidePanel.style.left  = UNDOCK_DEFAULT_OFFSET_LEFT;
  } else {
    sidePanel.style.top   = undockedLoc.top;
    sidePanel.style.left  = undockedLoc.left;
  }
  sidePanel.style.height = panelUndockedHeight;
  sidePanel.style.width  = panelWidth;

  document.getElementById("undockBtn").style.display = "none";
  document.getElementById("dockBtn").style.display = "";  // default

  enableDragging();
  enableResizing(rightBorderOnly = false);
  if (isOrigin) {
    // update panel state
    chrome.storage.local.set({
      WILLOW_SP_UNDOCKED: true,
      WILLOW_SP_UNDOCKED_LOC: {
        top: sidePanel.style.top,
        left: sidePanel.style.left
      }
    });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_UNDOCK",
    });
  }
}

function dockSidePanel(isOrigin) {
  // put the panel back in its place
  sidePanel.style.top = "0px";
  sidePanel.style.left = "0px";
  sidePanel.style.height = "100%";

  document.getElementById("dockBtn").style.display = "none";
  document.getElementById("undockBtn").style.display = "";  // default

  disableDragging();
  enableResizing(rightBorderOnly = true);
  if (isOrigin) {
    // update panel state
    chrome.storage.local.set({
      WILLOW_SP_UNDOCKED: false
    });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_DOCK",
    });
  }
}

function disableDragging() {
  document.getElementById("panelHeader").onmousedown = null;
}

function enableDragging() {
  var deltaX = 0, deltaY = 0, lastX = 0, lastY = 0;
  document.getElementById("panelHeader").onmousedown = dragMouseDown;

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

function enableResizing(rightBorderOnly) {
  var deltaX = 0, lastX = 0, deltaY = 0, lastY = 0;
  var heldBorder = "";

  document.getElementById("rightBorder").onmousedown  = (e) => resizeMouseDown(e, "right" );

  if (rightBorderOnly) {
    document.getElementById("leftBorder").onmousedown   = null;
    document.getElementById("topBorder").onmousedown    = null;
    document.getElementById("bottomBorder").onmousedown = null;

    document.getElementById("leftBorder").style.cursor    = "";
    document.getElementById("topBorder").style.cursor     = "";
    document.getElementById("bottomBorder").style.cursor  = "";
  } else {
    document.getElementById("leftBorder").onmousedown   = (e) => resizeMouseDown(e, "left"  );
    document.getElementById("topBorder").onmousedown    = (e) => resizeMouseDown(e, "top"   );
    document.getElementById("bottomBorder").onmousedown = (e) => resizeMouseDown(e, "bottom");

    document.getElementById("leftBorder").style.cursor    = "ew-resize";
    document.getElementById("topBorder").style.cursor     = "ns-resize";
    document.getElementById("bottomBorder").style.cursor  = "ns-resize";
  }
  
  function resizeMouseDown(e, border) {
    e = e || window.event;
    e.preventDefault();

    lastX = e.clientX;
    lastY = e.clientY;
    heldBorder = border;

    document.getElementById("graphInvisLayer").style.zIndex = 1;

    document.onmouseup = resizeMouseUp;
    document.onmousemove = resizeMouseMove;
  }

  function resizeMouseMove(e) {
    e = e || window.event;
    e.preventDefault();

    let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  
    // mousemove events may trigger out of the window (when the panel is dragged off-screen)
    // if clientX/clientY are out of the window, then elementFromPoint returns null
    if (!elemBelow) return;

    deltaX = e.clientX - lastX;
    lastX = e.clientX;
    deltaY = e.clientY - lastY;
    lastY = e.clientY;
    var curWidth = parseInt(sidePanel.style.width, 10);
    var curHeight = parseInt(sidePanel.style.height, 10);

    document.getElementById("willowLabel").style.display = "none";
    document.getElementById("willowLabel").style.display = "";

    if (heldBorder == "right") {
      if (curWidth + deltaX > RESIZE_MIN_WIDTH) {
        if (curWidth + deltaX >= 590){
          let wlwLabel = document.getElementById("willowLabel");
          wlwLabel.classList.remove('shrinkTrans');
          //document.getElementById("willowLabel").style.display = "";
          //console.log("current wid: " + curWidth + " deltaX: " + deltaX);
        }
        else {
          let wlwLabel = document.getElementById("willowLabel");
          wlwLabel.classList.add('shrinkTrans');
          //document.getElementById("willowLabel").style.display = "none";
        }

        sidePanel.style.width = (curWidth + deltaX) + "px";
      }
    } else if (heldBorder == "left") {
      if (curWidth - deltaX > RESIZE_MIN_WIDTH) {
        if (curWidth - deltaX >= 590){
          let wlwLabel = document.getElementById("willowLabel");
          wlwLabel.classList.remove('shrinkTrans');
          //document.getElementById("willowLabel").style.display = "";
        }
        else {
          let wlwLabel = document.getElementById("willowLabel");
          wlwLabel.classList.add('shrinkTrans');
          //document.getElementById("willowLabel").style.display = "none";
        }

        sidePanel.style.width = (curWidth - deltaX) + "px";
        sidePanel.style.left = (parseInt(sidePanel.style.left, 10) + deltaX) + "px";
      }
    } else if (heldBorder == "top") {
      if (curHeight - deltaY >= RESIZE_MIN_HEIGHT) {
        sidePanel.style.height = (curHeight - deltaY) + "px";
        sidePanel.style.top = (parseInt(sidePanel.style.top, 10) + deltaY) + "px";
      }
    } else if (heldBorder == "bottom") {
      if (curHeight + deltaY >= RESIZE_MIN_HEIGHT) {
        sidePanel.style.height = (curHeight + deltaY) + "px";
      }
    }
    
  }

  function resizeMouseUp() {
    document.getElementById("graphInvisLayer").style.zIndex = -1;

    // end of drag. remove handlers.
    document.onmouseup = null;
    document.onmousemove = null;

    // save new panel Width
    chrome.storage.local.set({
      WILLOW_SP_WIDTH: sidePanel.style.width,
      WILLOW_SP_UD_HEIGHT: sidePanel.style.height
    });

    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_DOCKED_RESIZE",
      newWidth: sidePanel.style.width
    });
  }
}

/*****************************************************************************
*******************    Implementation of SidePanelSyncer   ******************* 
*****************************************************************************/

// listen for sidePanel sync requests
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message != "WILLOW_SP_SYNC_REQUEST") {
        return;
    }
    handleSPSyncRequest(request);
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
  } else if (request.action == "WILLOW_SP_SYNC_DOCKED_RESIZE") {
    sidePanel.style.width = request.newWidth;
  } 
}

/**
 * The low level design report includes the function sendSyncRequest() in SidePanelSyncer.
 * This function is currently ditched. There does not seem to be much to be abstracted.
 * SidePanel sends the requests directly.
 */
