let panelWidth = "400px";
let iconWidth = "66px";
let iconHeight = "66px";

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
        }
    }
  );
