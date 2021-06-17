/**
 * This file contains the implementation of both (SidePanel and SidePanelSyncer).
 * We want these two objects to be able to access each other's functions without
 * having to pass messages. As fas as my current knowledge extends, the only way
 * to enable this is to put them in the same file.
 */

/*****************************************************************************
 **********************    Implementation of SidePanel   **********************
 *****************************************************************************/

//--------------------------------//
//        Global CONSTANTS        //
//--------------------------------//
var sidePanelHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/side_panel.css")}">
  
  <script src="cytoscape.min.js"></script>
  <script src="node_modules/dagre/dist/dagre.min.js"></script>
  <script src="node_modules/cytoscape-dagre/cytoscape-dagre.js"></script>
</head>
<body>
<div id="willow-sidePanel">
  <div id="willow-panelHeader">
  
    <img title="Willow: Graph-Based Browsing" id="willow-willowIcon" src="${chrome.extension.getURL("../../images/willowIcon_50x50.png")}" alt="Willow">
    <a class="willow-label" id="willow-willowLabel" style="display:;">W I L L O W</a>
    
    <button title="Close"         class="willow-headerBtn willow-btn-close"     id="willow-closeBtn"                                </button>
    <button title="View in Dedicated Tab"         class="willow-headerBtn willow-btn-newTab"   id="willow-newTabBtn"                               </button>
    <button title="Dock"          class="willow-headerBtn willow-btn-dock"      id="willow-dockBtn"      style="display:none;"      </button>
    <button title="Undock"        class="willow-headerBtn willow-btn-undock"    id="willow-undockBtn"                               </button>
    <button title="Settings"      class="willow-headerBtn willow-btn-settings"  id="willow-settingsBtn"                             </button>
    <button title="New Session"   class="willow-headerBtn willow-btn-new"       id="willow-newBtn"                                  </button>
    <button title="Run Layout"    class="willow-headerBtn willow-btn-layout"    id="willow-layoutBtn"                               </button>
    
  </div>
  <div id="willow-panelBody">
    <iframe id="willow-graphFrame" src="${chrome.runtime.getURL("GraphOverlay/Graph/GraphDrawer.html")}"></iframe>
    <div id="willow-graphInvisLayer"></div>
  </div>
  <div class="willow-border" id="willow-leftBorder"></div>
  <div class="willow-border" id="willow-rightBorder"></div>
  <div class="willow-border" id="willow-topBorder"></div>
  <div class="willow-border" id="willow-bottomBorder"></div>
</div>
</body>
</html>
`
alert("side panel running");
//variables
///----------------
var sidePanel;   // the HTML div that is the side panel. Saved here to avoid getting it from the document each time it's needed.

//Script-------------
injectSidePanel();

//functions---------
// Create and insert sidePanel
function injectSidePanel() {

  var panelWrapper = document.createElement('div');
  panelWrapper.id = "willowPanelWrapper";
  panelWrapper.innerHTML = sidePanelHTML;
  document.body.append(panelWrapper); // TODO: consider removing panelWrapper and inserting sidePanel only.

  // save sidePanel
  sidePanel = document.getElementById("willow-sidePanel");

  document.body.zIndex = -1;
  sidePanel.style.zIndex = 2147483647; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  //document.body.append(sidePanel); // part of upper TODO
}

//---------------------------------//
//---------------------------------//
//---------------------------------//
///Check if new tab is open or not
//---------------------------------//
//---------------------------------//
//---------------------------------//
chrome.storage.local.get(["WILLOW_WINDOW_OPEN", "WILLOW_SP_PSEUDO_OPEN"], function (res) {

  console.log("do we even come here?");
  if( res.WILLOW_WINDOW_OPEN)
  {
    //Psuedo open
      sidePanel.style.width = 0;

      // set global state
    if( !res.WILLOW_SP_PSEUDO_OPEN)
    {
      chrome.storage.local.set({WILLOW_SP_PSEUDO_OPEN: true});
    }

    alert( res.WILLOW_SP_PSEUDO_OPEN  + " ?");
    // notify other tabs with a sync request
       chrome.runtime.sendMessage({
          message: "WILLOW_SP_SYNC_REQUEST",
          action: "WILLOW_SP_SYNC_OPEN",
        });
  }
  else
  {

      var UNDOCK_DEFAULT_OFFSET_TOP = "10px";
      var UNDOCK_DEFAULT_OFFSET_LEFT = "10px";

      var RESIZE_MIN_WIDTH = 350;  // in px
      var RESIZE_MIN_HEIGHT = 350;  // in px



// end of constants


//------------------------//
//        VARIABLES       //
//------------------------//
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
  console.log( "WILLOW_SP_OPEN:" +res.WILLOW_SP_OPEN);
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

// register event handlers
document.getElementById("willow-closeBtn").onclick     = () => closeSidePanel(true);
document.getElementById("willow-newTabBtn").onclick     = () => openInNewTab(true);
document.getElementById("willow-undockBtn").onclick    = () => undockSidePanel(null, true);
document.getElementById("willow-dockBtn").onclick      = () => dockSidePanel(true);
document.getElementById("willow-newBtn").onclick       = () => startNewSession();
document.getElementById("willow-layoutBtn").onclick    = () => runLayoutBtn_handler();
document.getElementById("willow-settingsBtn").onclick  = () => toggleSettingsMenu();
enableResizing(rightBorderOnly = true);

// -- end of script


//------------------------//
//       FUNCTIONS        //
//------------------------//
function openInNewTab()
{
  console.log("openInNewTab");
  closeSidePanel(true);
  chrome.storage.local.set({ WILLOW_WINDOW_OPEN: true });
  chrome.runtime.sendMessage({
    message: "WILLOW_SP_SYNC_REQUEST",
    action: "WILLOW_SYNC_OPEN_NEW_TAB",
  });
}



// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

/**
 * isOrigin indicates whether this page has originated the opening event.
 * It is true if openSidePanel called in reaction to a user action and
 * false if it is reacting to async request.
 */
console.log("in side panel js");
function openSidePanel(isOrigin) {
  /*
  if (isOrigin) {
    sidePanel.style.transition = "all 0.5s";
  } else {
    sidePanel.style.transition = "all 0s";
  } */
  console.log("openSidePanel");

  sidePanel.style.width = panelWidth;

  if (isOrigin) {
    console.log("when origin is true");
    // set global state
    chrome.storage.local.set({ WILLOW_SP_OPEN: true });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_OPEN",
    });
  }

  // TODO: When to do this? Surely not everytime a page is loaded.

   // the graph needs to re-adjust its viewport after the panel is opened.
   // ! A timeout is used temporarily to ensure that the iframe is resized before adjusting the viewport.
   setTimeout(() => {
    chrome.runtime.sendMessage({
      message: "WILLOW_GRAPH_VIEWPORT_FIT",
    })
  }, 150);


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

  console.log( "closed");
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


function updateOpacity(willowOpacity){
  document.getElementById("willow-graphFrame").style.opacity = willowOpacity.opacity;
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
  //sidePanel.style.width  = panelWidth;

  document.getElementById("willow-undockBtn").style.display = "none";
  document.getElementById("willow-dockBtn").style.display = "";  // default

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

  document.getElementById("willow-dockBtn").style.display = "none";
  document.getElementById("willow-undockBtn").style.display = "";  // default

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

function enableResizing(rightBorderOnly) {
  var deltaX = 0, lastX = 0, deltaY = 0, lastY = 0;
  var heldBorder = "";

  document.getElementById("willow-rightBorder").onmousedown  = (e) => resizeMouseDown(e, "right" );

  if (rightBorderOnly) {
    document.getElementById("willow-leftBorder").onmousedown   = null;
    document.getElementById("willow-topBorder").onmousedown    = null;
    document.getElementById("willow-bottomBorder").onmousedown = null;

    document.getElementById("willow-leftBorder").style.cursor    = "";
    document.getElementById("willow-topBorder").style.cursor     = "";
    document.getElementById("willow-bottomBorder").style.cursor  = "";
  } else {
    document.getElementById("willow-leftBorder").onmousedown   = (e) => resizeMouseDown(e, "left"  );
    document.getElementById("willow-topBorder").onmousedown    = (e) => resizeMouseDown(e, "top"   );
    document.getElementById("willow-bottomBorder").onmousedown = (e) => resizeMouseDown(e, "bottom");

    document.getElementById("willow-leftBorder").style.cursor    = "ew-resize";
    document.getElementById("willow-topBorder").style.cursor     = "ns-resize";
    document.getElementById("willow-bottomBorder").style.cursor  = "ns-resize";
  }

  function resizeMouseDown(e, border) {
    e = e || window.event;
    e.preventDefault();

    lastX = e.clientX;
    lastY = e.clientY;
    heldBorder = border;

    document.getElementById("willow-graphInvisLayer").style.zIndex = 1;

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

    document.getElementById("willow-willowLabel").style.display = "";

    if (heldBorder == "right") {
      if (curWidth + deltaX > RESIZE_MIN_WIDTH) {
        if (curWidth + deltaX >= 590){
          let wlwLabel = document.getElementById("willow-willowLabel");
          wlwLabel.classList.add("willow-anim");
          wlwLabel.classList.remove('shrinkTrans');
          open = true;
        }
        else {
          let wlwLabel = document.getElementById("willow-willowLabel");
          wlwLabel.classList.add("willow-anim");
          wlwLabel.classList.add('shrinkTrans');
          open = false;
        }

        sidePanel.style.width = (curWidth + deltaX) + "px";
      }
    } else if (heldBorder == "left") {
      if (curWidth - deltaX > RESIZE_MIN_WIDTH) {
        if (curWidth - deltaX >= 590){
          let wlwLabel = document.getElementById("willow-willowLabel");
          wlwLabel.classList.add("willow-anim");
          wlwLabel.classList.remove('shrinkTrans');
          open = true;
        }
        else {
          let wlwLabel = document.getElementById("willow-willowLabel");
          wlwLabel.classList.add("willow-anim");
          wlwLabel.classList.add('shrinkTrans');
          open = false;
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
    document.getElementById("willow-graphInvisLayer").style.zIndex = -1;

    // end of drag. remove handlers.
    document.onmouseup = null;
    document.onmousemove = null;

    panelWidth = sidePanel.style.width;

    //sync msg of willow label
    if (open) { labelOpenMessage();}
    else      { labelCloseMessage();}

    // save new panel Width
    chrome.storage.local.set({
      WILLOW_SP_WIDTH: sidePanel.style.width,
      WILLOW_SP_UD_HEIGHT: sidePanel.style.height
    });

    // notify other tabs with a sync request
    chrome.runtime.sendMessage({
      message: "WILLOW_SP_SYNC_REQUEST",
      action: "WILLOW_SP_SYNC_RESIZE",
      newWidth: sidePanel.style.width,
      newHeight: sidePanel.style.height
    });

    // save as drag if panel location changed
    if (heldBorder == "left" || heldBorder == "top") {
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
      chrome.runtime.sendMessage({
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

// listen for sidePanel sync request
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "WILLOW_SP_SYNC_REQUEST") {
        handleSPSyncRequest(request);
      }
      else if (request.message == "WILLOW_LABEL_SYNC_REQUEST"){
        handleWillowLabelSyncRequest(request);
      }
      else if( request.message == "WILLOW_SHOW_AS_SIDE_PANEL")
      {
       // alert("message recieved");
        sidePanel.style.width = panelWidth;
        return Promise.resolve({response: "Hi from content script"});
        //sendResponse({farewell: "goodbye"});
        /*
        chrome.storage.local.get(["WILLOW_SP_PSEUDO_OPEN"], function (res)
        {
          alert(res.WILLOW_SP_PSEUDO_OPEN);
          if( res.WILLOW_SP_PSEUDO_OPEN ) {
            chrome.storage.local.set({WILLOW_SP_PSEUDO_OPEN: false});

            openSidePanel(true);
          }
        });

         */
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

  }
});