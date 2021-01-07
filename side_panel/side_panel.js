let panelWidth = "400px";   // this has to be the same as the definition in side_panel_ContentScript.js.
                            // find a way to share these constants.

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "open"}, function(response) {
            console.log(response.farewell);
        });
    });
    document.getElementById("mySidepanel").style.width = panelWidth;
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    document.getElementById("mySidepanel").style.width = "0px";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "close"}, function(response) {
            console.log(response.farewell);
        });
    }); 
} 

document.getElementById("openbtnInst").onclick = openNav;
document.getElementById("closebtnInst").onclick = closeNav;