// ----------------------------------- //
// Opening and closing the side panel  //
// ----------------------------------- //

let panelWidth = "400px";   // this has to be the same as the definition in side_panel_ContentScript.js.
                            // find a way to share these constants.

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "open"});
    });
    document.getElementById("mySidepanel").style.width = panelWidth;
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "close"});
    }); 
    document.getElementById("mySidepanel").style.width = "0px";
} 

chrome.storage.local.get("sidePanelOpen", function (res) {
    if (res.sidePanelOpen) {
        let sidePanel = document.getElementById("mySidepanel");
        // Trying to disable transition animation. Does not work right now.
        let tmp = sidePanel.style.transition;
        sidePanel.style.transition = "0s";
        document.getElementById("mySidepanel").style.width = panelWidth;
        sidePanel.style.transition = tmp;
    } else {
        document.getElementById("mySidepanel").style.width = 0;
    }
});

document.getElementById("openbtnInst").onclick = openNav;
document.getElementById("closebtnInst").onclick = closeNav;

// ----------------------------------- //
// Undocking and dragging              //
// ----------------------------------- //

// The code below is based on the tutorial at https://blog.crimx.com/2017/04/06/position-and-drag-iframe-en/

function undockSidePanel() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "undock"});
    }); 
    document.getElementById("panelHeader").addEventListener('mousedown', handleDragStart);
}

var baseMouseX, baseMouseY

function handleDragStart (evt) {
  baseMouseX = evt.clientX
  baseMouseY = evt.clientY

  window.parent.postMessage({
    msg: 'WILLOW_DRAG_START',
    mouseX: baseMouseX,
    mouseY: baseMouseY
  }, '*')

  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('mousemove', handleMousemove)
}

function handleMousemove (evt) {
  window.parent.postMessage({
    msg: 'WILLOW_DRAG_MOUSEMOVE',
    offsetX: evt.clientX - baseMouseX,
    offsetY: evt.clientY - baseMouseY
  }, '*')
}

function handleDragEnd () {
  window.parent.postMessage({
    msg: 'WILLOW_DRAG_END'
  }, '*')

  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('mousemove', handleMousemove)
}


document.getElementById("willowLabel").onclick = undockSidePanel;