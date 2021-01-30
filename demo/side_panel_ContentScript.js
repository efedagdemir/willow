let panelWidth = "400px";
let iconWidth = "70px";
let iconHeight = "70px";

var iframe  = document.createElement ('iframe');
iframe.src  = chrome.runtime.getURL('side_panel.html');
iframe.style.position = 'fixed';
iframe.style.top='0%';
iframe.style.left='0%';
iframe.style.border="0"; // need to remove the border somehow
chrome.storage.local.get("sidePanelOpen", function (res) {
    if (res.sidePanelOpen) {
        iframe.style.width = panelWidth;
        iframe.style.height = "100%";
    } else {
        iframe.style.width = iconWidth;
        iframe.style.height = iconHeight;
    }
});
document.body.zIndex = -1;
iframe.style.zIndex = 0x7FFFFFFF;
document.body.append(iframe);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command == "open") {
            iframe.style.height = "100%"
            iframe.style.width = panelWidth;
            chrome.storage.local.set({ sidePanelOpen: true });
        } else if (request.command == "close") {
            iframe.style.width = iconWidth;
            iframe.style.height = iconHeight;
            chrome.storage.local.set({ sidePanelOpen: false });
        } else if (request.command == "undock") {
            iframe.style.height = "86%";
            iframe.style.top = "2%";
            iframe.style.left = "15px";
            enableDragging();
        }
    }
  );

// ----------------------------------- //
// Undocking and dragging              //
// ----------------------------------- //

function enableDragging() {
    window.addEventListener('message', evt => {
        const data = evt.data
        switch (data.msg) {
          case 'WILLOW_DRAG_START':
            handleDragStart(data.mouseX, data.mouseY)
            break
          case 'WILLOW_DRAG_MOUSEMOVE':
            handleFrameMousemove(data.offsetX, data.offsetY)
            break
          case 'WILLOW_DRAG_END':
            handleDragEnd()
            break
        }
      })
      frameTop = parseInt(iframe.style.top);
      frameLeft = parseInt(iframe.style.left);
}

// The code below is based on the tutorial at https://blog.crimx.com/2017/04/06/position-and-drag-iframe-en/

var pageMouseX, pageMouseY

var frameTop;
var frameLeft;

function handleDragStart (mouseX, mouseY) {
  // get the coordinates within the upper frame
  pageMouseX = frameLeft + mouseX
  pageMouseY = frameTop + mouseY

  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('mousemove', handlePageMousemove)
}

function handleDragEnd () {
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('mousemove', handlePageMousemove)
}

function handleFrameMousemove (offsetX, offsetY) {
  frameTop += offsetY
  frameLeft += offsetX
  console.log("frameLeft: " + frameLeft);
  iframe.style.top = frameTop + 'px'
  iframe.style.left = frameLeft + 'px'

  // Add the missing coordinates
  pageMouseX += offsetX
  pageMouseY += offsetY
}

function handlePageMousemove (evt) {
  frameLeft += evt.clientX - pageMouseX
  frameTop += evt.clientY - pageMouseY
  iframe.style.top = frameTop + 'px'
  iframe.style.left = frameLeft + 'px'

  pageMouseX = evt.clientX
  pageMouseY = evt.clientY
}
