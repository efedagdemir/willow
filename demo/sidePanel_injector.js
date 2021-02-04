//------------------------//
//        CONSANTS        //
//------------------------//
var HEADER_HEIGHT = "70px";
var ICON_WIDTH    = "70px";
var ICON_HEIGHT   = "70px";

var UNDOCK_DEFAULT_OFFSET_TOP   = "10px";
var UNDOCK_DEFAULT_OFFSET_LEFT  = "10px";
var UNDOCK_HEIGHT               = "80%";

var DOCKED_RESIZE_MIN_WIDTH = 200;  // in px

var sidePanelHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="${chrome.runtime.getURL("side_panel.css")}">
  
  <script src="cytoscape.min.js"></script>
  <script src="node_modules/dagre/dist/dagre.min.js"></script>
  <script src="node_modules/cytoscape-dagre/cytoscape-dagre.js"></script>
</head>

<body>
<div id="sidePanel">
  <div id="panelHeader">
    <a id="willowLabel">Willow</a>
    <a id="undockBtn">&raquo;</a>
    <a id="dockBtn" style="display:none;">&laquo;</a>
    <a id="closeBtn">&times;</a>
  </div>
  <div id="panelBody">
  </div>
  <div id="panelBorder"></div>
</div>

<img id="openBtn" src="${chrome.runtime.getURL("willowIcon_50x50.jpeg")}">
</body>
</html>
`
// end of constants


//------------------------//
//        VARIABLES       //
//------------------------//
var sidePanel;  // the HTML div that is the side panel.
var openBtn;    // the injected Willow icon that opens the side panel

var panelWidth;


//------------------------//
//         SCRIPT         //
//------------------------//
injectSidePanel();

// read panel state
chrome.storage.local.get(["WILLOW_SP_OPEN", "WILLOW_SP_UNDOCKED", "WILLOW_SP_UNDOCKED_LOC", "WILLOW_SP_WIDTH"], function (res) {
  panelWidth = res.WILLOW_SP_WIDTH;
  console.log("panelWidth: " + panelWidth);
  // The pannel is closed and docked by default. Update based on the stored state.
  if (res.WILLOW_SP_OPEN) {
    openSidePanel();
  }
  if (res.WILLOW_SP_UNDOCKED) {
    undockSidePanel(res.WILLOW_SP_UNDOCKED_LOC);
  }
});

// register event handlers
document.getElementById("openBtn").onclick   = openSidePanel;
document.getElementById("closeBtn").onclick  = closeSidePanel;
document.getElementById("undockBtn").onclick = undockSidePanel;
document.getElementById("dockBtn").onclick = dockSidePanel;

enableDockedResizing();

// end of script


//------------------------//
//       FUNCTIONS        //
//------------------------//

// Create and insert sidePanel
function injectSidePanel() {
  var panelWrapper  = document.createElement ('div');
  panelWrapper.id = "willowPanelWrapper";
  panelWrapper.innerHTML = sidePanelHTML;
  document.body.append(panelWrapper); // TODO: consider removing panelWrapper and inserting sidePanel only.

  // save the following two elements as global variables for the other functions
  sidePanel = document.getElementById("sidePanel");
  openBtn = document.getElementById("openBtn");

  document.body.zIndex = -1;
  sidePanel.style.zIndex = 1000; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  //document.body.append(sidePanel); // part of upper TODO
}

// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

function openSidePanel() {
  sidePanel.style.width = panelWidth;
  openBtn.style.display = "none";
  chrome.storage.local.set({WILLOW_SP_OPEN: true});
}

function closeSidePanel() {
  openBtn.style.display = "";  // default
  sidePanel.style.width = "0px";
  chrome.storage.local.set({WILLOW_SP_OPEN: false});
}

function undockSidePanel(undockedLoc) {
  console.log(undockedLoc);
  if (!(undockedLoc && undockedLoc.left && undockedLoc.top)) { // if called without proper input (sometimes intentionally)
    // "pop" the panel 
    sidePanel.style.top = UNDOCK_DEFAULT_OFFSET_TOP;
    sidePanel.style.left = UNDOCK_DEFAULT_OFFSET_LEFT;
  } else {
    sidePanel.style.top = undockedLoc.top;
    sidePanel.style.left = undockedLoc.left;
  }
  sidePanel.style.height = UNDOCK_HEIGHT;

  document.getElementById("undockBtn").style.display = "none";
  document.getElementById("dockBtn").style.display = "";  // default

  // update panel state
  chrome.storage.local.set({
    WILLOW_SP_UNDOCKED: true,
    WILLOW_SP_UNDOCKED_LOC: {
      top: sidePanel.style.top,
      left: sidePanel.style.left
    }   
  });

  enableDragging();
}

function dockSidePanel() {
  // put the panel back in its place
  sidePanel.style.top = "0px";
  sidePanel.style.left = "0px";
  sidePanel.style.height = "100%";

  document.getElementById("dockBtn").style.display = "none";
  document.getElementById("undockBtn").style.display = "";  // default

  // update panel state
  chrome.storage.local.set({
    WILLOW_SP_UNDOCKED: false
  });

  disableDragging();
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
  }
}

function enableDockedResizing() {
  var deltaX = 0, lastX = 0;
  document.getElementById("panelBorder").onmousedown = resizeMouseDown;

  function resizeMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    lastX = e.clientX;

    document.onmouseup = resizeMouseUp;
    document.onmousemove = resizeMouseMove;
  }

  function resizeMouseMove(e) {
    e = e || window.event;
    e.preventDefault();
    deltaX = e.clientX - lastX;
    lastX = e.clientX;
  
    var curWidth = parseInt(sidePanel.style.width, 10);
    if (curWidth + deltaX >= DOCKED_RESIZE_MIN_WIDTH) {
      sidePanel.style.width = (parseInt(sidePanel.style.width, 10) + deltaX) + "px";
    }
  }

  function resizeMouseUp() {
    // end of drag. remove handlers.
    document.onmouseup = null;
    document.onmousemove = null;

    // save new undocked panel location
    
    chrome.storage.local.set({
      WILLOW_SP_WIDTH: sidePanel.style.width
    });
  }
}

