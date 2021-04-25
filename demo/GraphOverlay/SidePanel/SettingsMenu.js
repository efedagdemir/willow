// initialize the menu's open/closee state
chrome.storage.local.get(["WILLOW_SETTINGS_OPEN"], function (res) {
  if (res.WILLOW_SETTINGS_OPEN) {
    openSettingsMenu(false);
  }
});


var menuWrapper;
/**
 * SidePanel.js registers this funtction as the onclick handler of the settings button.
 * See openSidePanel et al. for the meaning of isOrigin.
 */

/*Put settingsMenuHTML here to avoid getting null value for opacity of the graph frame */
function openSettingsMenu(isOrigin) {
    menuWrapper = document.createElement('div');
    menuWrapper.id = "willowSettingsMenuWrapper";
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
                <div id="resetSizesUniBtn" class="opt"> <button title="Set all nodes to the default size" >Uniform</button></div>
                <div id="resetSizesPRBtn" class="opt">  <button title="Node sizes are set according to their importance on search engine results" >PageRank</button></div>
            </div>
            <div class="settingElement" id="runLayout" class>
                <div class="label"> <b>Run layout: </b></div>
                <div id="runLayoutAdjustBtn" class="opt"> <button title="Adjust the layout based on the recent changes" >Adjust</button></div>
                <div id="runLayoutRecalcBtn" class="opt"> <button title="Recalculate the layout from scratch" >Recalculate</button></div>
            </div>
            <div class="settingElement" id ="setTrans" class>
                <div class= "label"> <b>Background opacity: </b></div>
                <div class = "opt">
                    <input type="range" id="sliderTrans"
                        min="0.75" max="1" step="0.005" value="${getComputedStyle(document.getElementById("graphFrame")).getPropertyValue("opacity")}"/>
                </div>
            </div>
            <br>
            <table id="settings_button_table">
                <tr>
                    <th> <button id="exportBtn" class="table-buttons" title="Save the graph as a file">Export Session</button></th>
                    <th> <button id="importBtn" class="table-buttons" title="Open a Pre-saved Graph from Files">Import Session</button></th>
                    
                </tr>
                <tr>
                    <th> <button id="infoBtn"  class="table-buttons" title="Open 'Information' Page">Info</button></th>
                    <th> <button id="howToBtn" class="table-buttons" title="Open 'How To?' Page">How to?</button></th>
                </tr>
                <tr>
                    <th> <button id="historyBtn"  class="table-buttons" title="Show History">History</button></th>
                </tr>
            <table>
        </div>
    </div>
    </body>
    </html>
    `;
    menuWrapper.innerHTML = settingsMenuHTML;
    document.getElementById("panelBody").appendChild(menuWrapper);
    document.getElementById("settingsBtn").onclick = () => closeSettingsMenu(true); 
    addSettingsMenuListeners();

    if (isOrigin) {
        // set global state
        chrome.storage.local.set({ WILLOW_SETTINGS_OPEN: true });
        // notify other tabs with a sync request
        chrome.runtime.sendMessage({ 
          message: "WILLOW_SETTINGS_SYNC_REQUEST",
          action: "WILLOW_SETTINGS_SYNC_OPEN",
        });
    }
}

function closeSettingsMenu(isOrigin) {
    menuWrapper.parentNode.removeChild(menuWrapper);
    document.getElementById("settingsBtn").onclick = () => openSettingsMenu(true);

    if (isOrigin) {
        // set global state
        chrome.storage.local.set({ WILLOW_SETTINGS_OPEN: false });
        // notify other tabs with a sync request
        chrome.runtime.sendMessage({ 
          message: "WILLOW_SETTINGS_SYNC_REQUEST",
          action: "WILLOW_SETTINGS_SYNC_CLOSE",
        });
    }
}

function addSettingsMenuListeners() {
    document.getElementById("resetSizesUniBtn").onclick     = resetSizesUniBtn_handler; 
    document.getElementById("resetSizesPRBtn").onclick      = resetSizesPRBtn_handler; 
    document.getElementById("runLayoutAdjustBtn").onclick   = runLayoutAdjustBtn_handler; 
    document.getElementById("runLayoutRecalcBtn").onclick   = runLayoutRecalcBtn_handler; 
    document.getElementById("sliderTrans").oninput          = sliderTrans_handler; 
    document.getElementById("exportBtn").onclick            = exportBtn_handler; 
    document.getElementById("importBtn").onclick            = importBtn_handler; 
    document.getElementById("historyBtn").onclick           = historyBtn_handler; 
    document.getElementById("infoBtn").onclick     = () =>    openInfoPage();      //defined in InfoPage.js
    document.getElementById("howToBtn").onclick    = () =>    openHowToPage();     //defined in HowToPage.js

}

function resetSizesUniBtn_handler() {
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_RESET_NODE_SIZES",
        option: "uniform"
    });
}

function resetSizesPRBtn_handler() {
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_RESET_NODE_SIZES",
        option: "pagerank"
    });
}

function runLayoutAdjustBtn_handler() {
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_RUN_LAYOUT",
        option: "incremental"
    });
}

function runLayoutRecalcBtn_handler() {
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_RUN_LAYOUT",
        option: "recalculate"
    });
}

function sliderTrans_handler() {
    var object =  document.getElementById("graphFrame");
    object.style.opacity = document.getElementById("sliderTrans").value.toString();
    chrome.storage.local.get(["WILLOW_OPACITY_UPDATE"], function (res) {
        chrome.storage.local.set({
            WILLOW_OPACITY_UPDATE : true,
            WILLOW_OPACITY: {
              opacity : document.getElementById("sliderTrans").value.toString()
            }
          });
        
    });
}

function exportBtn_handler(){
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_EXPORT",
    });
}

function importBtn_handler(){
    var input = document.createElement("INPUT");
    input.setAttribute("type", "file");
    input.addEventListener("change",  () => {
        const reader = new FileReader();
        reader.readAsText(input.files[0])
        reader.onload = function () {
            chrome.runtime.sendMessage({
                message: "WILLOW_BACKGROUND_IMPORT",
                json: JSON.parse(reader.result),
            });
        }
    });
    input.click();
}

function historyBtn_handler() {
    chrome.runtime.sendMessage({
        message: "WILLOW_HISTORY_SHOW",
    });
}

/**
 * SYNCING SETTINGS MENU OPEN/CLOSED SETTINGS
 */

// listen for settings menu sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message != "WILLOW_SETTINGS_SYNC_REQUEST") {
          return;
      }
      handleSettingsSyncRequest(request);
    }
);

function handleSettingsSyncRequest(request) {
    if (request.action == "WILLOW_SETTINGS_SYNC_OPEN") {
        openSettingsMenu(false);
    } else if (request.action == "WILLOW_SETTINGS_SYNC_CLOSE") {
        closeSettingsMenu(false);    
    }
}