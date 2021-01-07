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
        document.getElementById("mySidepanel").style.width = panelWidth;
    } else {
        document.getElementById("mySidepanel").style.width = 0;
    }
});

document.getElementById("openbtnInst").onclick = openNav;
document.getElementById("closebtnInst").onclick = closeNav;