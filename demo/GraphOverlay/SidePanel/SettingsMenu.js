var menuWrapper;
/*Put settingsMenuHTML here to avoid getting null value for opacity of the graph frame */
function openSettingsMenu() {
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
                <div id="resetSizesUniBtn" class="opt"> <button>Uniform</button></div>
                <div id="resetSizesPRBtn" class="opt"> <button>PageRank</button></div>
            </div>
            <div class="settingElement" id="runLayout" class>
                <div class="label"> <b>Run layout: </b></div>
                <div id="runLayoutAdjustBtn" class="opt"> <button>Adjust</button></div>
                <div id="runLayoutRecalcBtn" class="opt"> <button>Recalculate</button></div>
            </div>
            <div class="settingElement" id ="setTrans" class>
                <div class= "label"> <b>Background transparency: </b></div>
                <div class = "opt">
                    <input type="range" id="sliderTrans"
                        min="0" max="1" step="0.05" value="${getComputedStyle(document.getElementById("graphFrame")).getPropertyValue("opacity")}"/>
                </div>
            </div>
        </div>
    </div>
    </body>
    </html>
    `;
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
    document.getElementById("resetSizesUniBtn").onclick     = resetSizesUniBtn_handler; 
    document.getElementById("resetSizesPRBtn").onclick      = resetSizesPRBtn_handler; 
    document.getElementById("runLayoutAdjustBtn").onclick   = runLayoutAdjustBtn_handler; 
    document.getElementById("runLayoutRecalcBtn").onclick   = runLayoutRecalcBtn_handler; 
    document.getElementById("sliderTrans").oninput          = sliderTrans_handler; 
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
}