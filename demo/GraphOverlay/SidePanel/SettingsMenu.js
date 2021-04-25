// initialize the menu's open/closee state
chrome.storage.local.get(["WILLOW_SETTINGS_OPEN","WILLOW_HOW_TO_OPEN", "WILLOW_INFO_OPEN"], function (res) {
  if (res.WILLOW_SETTINGS_OPEN && !res.WILLOW_HOW_TO_OPEN && !res.WILLOW_INFO_OPEN) {
      console.log("bir")
      openSettingsMenu(false);
  }
});

var menuIsOpen = false;

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
            <button type="button" id="settings_close_btn"></button>
            
        </div>
        <div id="menuBody">
            <div class="settingElement" id="resetNodeSizes" class>
            <div class="label"> <b>Reset node sizes: </b></div>
            <div id="resetSizesUniBtn" class="opt"> <button title="Set all nodes to the default size" >Uniform</button></div>
            <div id="resetSizesPRBtn" class="opt">  <button title="Node sizes are set according to their importance on search engine results" >PageRank</button></div>
        </div>
        <div class="settingElement" id="runLayout" class>
            <div class="label"> <b>Run layout: </b></div>
            <label class="layout_radio">Adjust
                <input type="radio" name="radio" id="layout_radio1">
                <span class="span_radio"></span>
            </label>
            <label class="layout_radio">Recalculate
                <input type="radio" name="radio" id="layout_radio2">
                <span class="span_radio"></span>
        </div>
            </label>
    </div>
            <div class="settingElement" id ="setTrans" class>
                <div class= "label"> <b>Background opacity: </b></div>
                <div class = "opt">
                    <input type="range" id="sliderTrans"
                        min="0.75" max="1" step="0.005" value="${getComputedStyle(document.getElementById("canvas")).getPropertyValue("opacity")}"/>
            </div>
                </div>
            <br>
            <table id="settings_button_table">
                <tr class="space_table_cell">
                    <td> <button id="exportBtn" class="table-buttons" title="Save the graph as a file">Export Session</button></th>
                    <td> <button id="importBtn" class="table-buttons" title="Open a Pre-saved Graph from Files">Import Session</button></th>
                </tr> 
                <tr>
                    <td> <button id="infoBtn"  class="table-buttons" title="Open 'Information' Page">Information</button></th>
                    <td> <button id="howToBtn" class="table-buttons" title="Open 'How To?' Page">How to?</button></th>
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
    document.body.append(menuWrapper);
    addSettingsMenuListeners();
    arrangeLayoutRadioButton(); 

    menuIsOpen = true;
}

function closeSettingsMenu(isOrigin) {
    
    chrome.storage.local.get(["WILLOW_HOW_TO_OPEN", "WILLOW_INFO_OPEN"], function (res) {
        if (res.WILLOW_INFO_OPEN)
            closeInfoPage(true);
        else if (res.WILLOW_HOW_TO_OPEN)
            closeHowToPage(true);
    }); 
    if (document.body.contains(menuWrapper)) {
        document.body.removeChild(menuWrapper);
    }
    menuIsOpen = false;
    
    chrome.storage.local.get(["WILLOW_HOW_TO_OPEN", "WILLOW_INFO_OPEN"], function (res) {
        if (res.WILLOW_INFO_OPEN)
            closeInfoPage(true);
        else if (res.WILLOW_HOW_TO_OPEN)
            closeHowToPage(true);
    }); 
}

function addSettingsMenuListeners() {
    document.getElementById("resetSizesUniBtn").onclick     = resetSizesUniBtn_handler; 
    document.getElementById("resetSizesPRBtn").onclick      = resetSizesPRBtn_handler;
    document.getElementById("sliderTrans").oninput          = sliderTrans_handler; 
    document.getElementById("exportBtn").onclick            = exportBtn_handler; 
    document.getElementById("importBtn").onclick            = importBtn_handler; 
    document.getElementById("historyBtn").onclick           = historyBtn_handler; 
    document.getElementById("infoBtn").onclick     = () =>    openInfoPage(true);      //defined in InfoPage.js
    document.getElementById("howToBtn").onclick    = () =>    openHowToPage(true);     //defined in HowToPage.js
    document.getElementById("layout_radio1").addEventListener("change", function(event) {radiBtn_handler(1)});
    document.getElementById("layout_radio2").addEventListener("change", function(event) {radiBtn_handler(2)});
}

/* Initializes the radio button check status */
function arrangeLayoutRadioButton(){
    chrome.storage.local.get(["WILLOW_LAYOUT_OPT"], function (res) {
        if (res.WILLOW_LAYOUT_OPT == 1)
            document.getElementById("layout_radio1").checked = "checked";
        else 
            document.getElementById("layout_radio2").checked = "checked";
    });
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


function sliderTrans_handler() {
    var object =  document.getElementById("canvas");
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

/* Sends synchronization message about 
   which radio button was checked     */
function radiBtn_handler(button_no){

    chrome.storage.local.set({ WILLOW_LAYOUT_OPT: button_no });
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
        message: "WILLOW_RADIO_SYNC_REQUEST",
        button_no: button_no
    });
}


/**
 * SYNCING SETTINGS MENU OPEN/CLOSED SETTINGS
 */

// listen for settings menu sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "WILLOW_SETTINGS_SYNC_REQUEST") {
            handleSettingsSyncRequest(request);
        }
        else if ( request.message == "WILLOW_RADIO_SYNC_REQUEST"){
            chrome.storage.local.set({ WILLOW_LAYOUT_OPT: request.button_no });  
            document.getElementById("layout_radio" + request.button_no).checked = "checked";
        } /*else if (request.message == "WILLOW_TOGGLE_SETTINGS_MENU") {
            console.log("toggle message recv.");
            if (menuIsOpen) {
                closeSettingsMenu(true);
            } else {
                openSettingsMenu(true);
            }
        }*/
    }
);

function handleSettingsSyncRequest(request) {
    if (request.action == "WILLOW_SETTINGS_SYNC_OPEN") {
        console.log("sync_open recv.");
        openSettingsMenu(false);
    } else if (request.action == "WILLOW_SETTINGS_SYNC_CLOSE") {
        console.log("sync_closed recv.");
        closeSettingsMenu(false);    
    }
}