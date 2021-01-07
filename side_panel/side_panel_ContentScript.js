let panelWidth = "400px";
let iconWidth = "60x";
let iconHeight = "70px";

var openBtn = document.createElement('button');
openBtn.style.position = 'fixed';

// The part below is borrowed form Tuana's code
var iframe  = document.createElement ('iframe');
iframe.src  = chrome.runtime.getURL('side_panel.html');
iframe.style.position = 'fixed';
iframe.style.top='0%'
iframe.style.left='0%'
// initally, the iframe is icon-sized, not panel-sized
iframe.style.width = iconWidth;
iframe.style.height = iconHeight;

document.body.zIndex = -1;
iframe.style.zIndex = 0x7FFFFFFF;

document.body.append(iframe);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command == "open") {
            iframe.style.height = "100%"
            iframe.style.width = panelWidth;
        } else if (request.command == "close") {
            iframe.style.width = iconWidth;
            iframe.style.height = iconHeight;
        }
    }
  );
