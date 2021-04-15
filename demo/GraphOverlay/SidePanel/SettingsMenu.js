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
        <div class="opt"> <button>Uniform</button></div>
        <div class="opt"> <button>PageRank</button></div>
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
}

function closeSettingsMenu() {
    menuWrapper.parentNode.removeChild(menuWrapper);
    document.getElementById("settingsBtn").onclick = () => openSettingsMenu(); 
}