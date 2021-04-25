let previewPane = document.getElementById("previewPane");
let previewImg = document.getElementById("previewImg");
let sessionList = document.getElementById("sessionList");
let curTitle = document.getElementById("curTitle");
let restoreBtn = document.getElementById("restoreBtn");
let renameBtn = document.getElementById("renameBtn");
let deleteBtn = document.getElementById("deleteBtn");
let curSession;
let curHistElement;

initialize();

function initialize() {
    // add session elements for all saved sessions.
    chrome.storage.local.get( {sessions:[]}, function(res) {
        res.sessions.forEach( session => {
            addSessionElements(session);
        });
        if (res.sessions.length > 0) {
            curSession = res.sessions[0];
            updatePreview();
        } else {
            clearPreview();
        }
    });
}

restoreBtn.addEventListener("click", function () {
    chrome.runtime.sendMessage(
        { message: "WILLOW_HISTORY_LOAD_SESSION", id: curSession.data.id},
        () => {location.reload()} // reload hist. page after restoring
    );
});
renameBtn.addEventListener("click", function() {
    let name = prompt("Enter new name:");
    chrome.runtime.sendMessage(
        {message: "WILLOW_HISTORY_RENAME_SESSION", id: curSession.data.id, name: name},
        () => {location.reload()} // reload hist. page after renaming
    );
});
deleteBtn.addEventListener("click", function () {
    // TODO
    alert("GETCHO ASS UP CEM!");
});


/**
 * 
 * @param {Object} session A cytoscape export.
 */
function addSessionElements (session) {
    console.log(session);
    // --- create the html elements ---
    let rootDiv = document.createElement("div");
    let titleDiv = document.createElement("div");

    // --- set the properties ---
    rootDiv.className = "historyElement";
    titleDiv.className = "label";
    titleDiv.innerHTML = "<b>" + getSessionTitle(session) + "</b>";

    rootDiv.appendChild(titleDiv);
    sessionList.appendChild(rootDiv);
    
    // --- add listeners ---
    rootDiv.addEventListener("mouseover", function() {
        activateHistElement(rootDiv);
        curSession = session;
        updatePreview();
    });

    // quick fix that initializes the active item
    if (!curHistElement) {
        activateHistElement(rootDiv);
    }
}

function updatePreview() {
    previewPane.style.display = ""; // default in case previously none'd
    previewImg.setAttribute("src", curSession.data.png);
    curTitle.innerHTML = getSessionTitle(curSession);
}

function clearPreview() {
    previewPane.style.display = "none";
}

function activateHistElement(e) {
    if (curHistElement)
        curHistElement.style.border = "1px solid #f4d58d";
    e.style.border = "3px solid #f4d58d";
    curHistElement = e;
}

function getSessionTitle(session) {
    if (session.data.name)
        return session.data.name;
    else
        return session.data.lastUpdated;
}