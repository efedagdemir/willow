var settingsMenuHTML = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/settings_menu.css")}">
</head>

<body>
<div id="settingsMenu">
    <div id="menuHeader">
        <b>SETTINGS</b>
        <hr>
    </div>
  <div id="menuBody">
    <div class="settingElement" id="resetNodeSizes" class>
        <div class="label"> <b>Reset node sizes: </b></div>
        <div id="resetSizesUniBtn" class="opt"> <button>Uniform</button></div>
        <div id="resetSizesPRBtn" class="opt"> <button>PageRank</button></div>
    </div>
  </div>
</div>
</body>
</html>
`

var menuWrapper;

function openSettingsMenu() {
    menuWrapper = document.createElement('div');
    menuWrapper.id = "willowSettingsMenuWrapper";
    menuWrapper.innerHTML = settingsMenuHTML;
    document.getElementById("panelBody").appendChild(menuWrapper);
    document.getElementById("settingsBtn").onclick = () => closeSettingsMenu();  
    addSettingsMenuListeners();
}

function closeSettingsMenu() {
    menuWrapper.parentNode.removeChild(menuWrapper);
    document.getElementById("settingsBtn").onclick = () => openSettingsMenu(); 
}

function addSettingsMenuListeners() {
    document.getElementById("resetSizesUniBtn").onclick = function () {
        chrome.runtime.sendMessage({
            message: "WILLOW_BACKGROUND_RESET_NODE_SIZES",
            option: "uniform"
        });
        // ! A timeout is used temporarily. Need to wait for response from the background.
        setTimeout(() => {
            // notify the other tabs of the change
            chrome.runtime.sendMessage({
                message: "WILLOW_GRAPH_SYNC_REQUEST",
                notifyActiveTab: true
            })
        }, 1000);
    }

    document.getElementById("resetSizesPRBtn").onclick = function () {
        chrome.runtime.sendMessage({
            message: "WILLOW_BACKGROUND_RESET_NODE_SIZES",
            option: "pagerank"
        });
        // ! A timeout is used temporarily. Need to wait for response from the background.
        setTimeout(() => {
            // notify the other tabs of the change
            chrome.runtime.sendMessage({
                message: "WILLOW_GRAPH_SYNC_REQUEST",
                notifyActiveTab: true
            })
        }, 1000);
    }
}
