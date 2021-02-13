//------------------------//
//        CONSANTS        //
//------------------------//
var PANEL_WIDTH   = "400px";
var HEADER_HEIGHT = "70px";
var ICON_WIDTH    = "70px";
var ICON_HEIGHT   = "70px";

var UNDOCK_OFFSET_TOP   = "10px";
var UNDOCK_OFFSET_LEFT  = "10px";
var UNDOCK_HEIGHT       = "80%";

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
    <a id="undockBtn">Undock</a>
    <a id="dockBtn" style="display:none;">Dock</a>
    <a id="closeBtn">Close</a>
  </div>
  <div id="panelBody">
  </div>
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

//------------------------//
//         SCRIPT         //
//------------------------//
injectSidePanel();

// register event handlers
document.getElementById("openBtn").onclick   = openSidePanel;
document.getElementById("closeBtn").onclick  = closeSidePanel;
document.getElementById("undockBtn").onclick = undockSidePanel;
document.getElementById("dockBtn").onclick = dockSidePanel;

// end of script



//------------------------//
//       FUNCTIONS        //
//------------------------//


// Create, style and insert sidePanel
function injectSidePanel() {
  var panelWrapper  = document.createElement ('div');
  panelWrapper.id = "willowPanelWrapper";
  panelWrapper.innerHTML = sidePanelHTML;
  document.body.append(panelWrapper); // TODO: consider removing panelWrapper and inserting sidePanel only.

  // save the following two elements as global variables for the other functions
  sidePanel = document.getElementById("sidePanel");
  openBtn = document.getElementById("openBtn");

  chrome.storage.local.get("WILLOW_SP_OPEN", function (res) {
    if (res.WILLOW_SP_OPEN) {
      openSidePanel();
    } else {
      closeSidePanel();
    }
  });
  document.body.zIndex = -1;
  sidePanel.style.zIndex = 2147483647; // how to choose this number? (to see the problem, set this to 1 and do a google search.)
  //document.body.append(sidePanel); // part of upper TODO
}

// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

function openSidePanel() {
  sidePanel.style.width = PANEL_WIDTH;
  openBtn.style.display = "none";
  
}

function closeSidePanel() {
  openBtn.style.display = "block";  // ????????????****
  sidePanel.style.width = "0px";
}

function undockSidePanel() {
  // "pop" the panel 
  sidePanel.style.top = UNDOCK_OFFSET_TOP;
  sidePanel.style.left = UNDOCK_OFFSET_LEFT;
  sidePanel.style.height = UNDOCK_HEIGHT;

  document.getElementById("undockBtn").style.display = "none";
  document.getElementById("dockBtn").style.display = "";

  enableDragging();
}

function dockSidePanel() {
  // put the panel back in its place
  sidePanel.style.top = "0px";
  sidePanel.style.left = "0px";
  sidePanel.style.height = "100%";

  document.getElementById("dockBtn").style.display = "none";
  document.getElementById("undockBtn").style.display = "";

  disableDragging();
}

function disableDragging() {
  document.getElementById("panelHeader").onmousedown = null;
}

function enableDragging() {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  document.getElementById("panelHeader").onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = dragMouseUp;
    // call a function whenever the cursor moves:
    document.onmousemove = dragMouseMove;
  }

  function dragMouseMove(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    sidePanel.style.top = (parseInt(sidePanel.style.top, 10) - pos2) + "px";
    sidePanel.style.left = (parseInt(sidePanel.style.left, 10) - pos1) + "px";
  }

  function dragMouseUp() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

