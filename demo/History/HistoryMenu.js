let previewPane = document.getElementById("previewPane");
let previewImg = document.getElementById("previewImg");
let sessionList = document.getElementById("sessionList");
let curTitle = document.getElementById("curTitle");
let restoreBtn = document.getElementById("restoreBtn");
let renameBtn = document.getElementById("renameBtn");
let deleteBtn = document.getElementById("deleteBtn");

let curSession;
let curHistElement;
let lockedSession;
let lockedHistElement;

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
   if(confirm("This will remove the session permanently, are you sure?")) {
    chrome.runtime.sendMessage(
        {message: "WILLOW_HISTORY_DELETE_SESSION", id: curSession.data.id},
        (response) => {
            if(response)
                location.reload() // reload hist. page after renaming
            else
                alert("Active session can not be removed");
        });
   }
});


/**
 * 
 * @param {Object} session A cytoscape export.
 */
function addSessionElements (session) {
    //console.log(session);
    // --- create the html elements ---
    let rootDiv = document.createElement("div");
    let titleDiv = document.createElement("div");
    let lastAccDiv = document.createElement("div");

    // --- set the properties ---
    rootDiv.className = "historyElement";
    titleDiv.className = "label";
    lastAccDiv.className = "opt"
    
    titleDiv.innerHTML = "<b>" + getSessionTitle(session) + "</b>";
    lastAccDiv.innerHTML = "<b> Last Access: " + session.data.lastUpdated + "</b>";

    rootDiv.appendChild(titleDiv);
    rootDiv.appendChild(lastAccDiv);
    sessionList.appendChild(rootDiv);
    
    // --- add listeners ---
    rootDiv.addEventListener("mouseover", function() {
        activateHistElement(rootDiv);
        curSession = session;
        curHistElement = rootDiv;
        updatePreview();
    });
    rootDiv.addEventListener("mouseleave", function() { 
        if (lockedHistElement && lockedHistElement != rootDiv) {
            
            rootDiv.style.border = "1px solid #f4d58d";
            curHistElement = null;
            curSession = lockedSession;
            updatePreview();
        }
    });
    rootDiv.addEventListener("mousedown", function() { 
        if (lockedHistElement == rootDiv) {
            lockedSession = null;
            lockedHistElement = null;
            rootDiv.style.border = "3px solid #f4d58d";
            return
        }
        lockedSession = session;
        lockHistElement(rootDiv);
        lockedHistElement = rootDiv;
    });


    // quick fix that initializes the active item
    if (!curHistElement) {
        activateHistElement(rootDiv);
        curHistElement = rootDiv;
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
    if (curHistElement && curHistElement != lockedHistElement)
        curHistElement.style.border = "1px solid #f4d58d";
    if (lockedHistElement != e) {
        e.style.border = "3px solid #f4d58d";
    }
}

function lockHistElement(e) {
    if (lockedHistElement) {
        lockedHistElement.style.border = "1px solid #f4d58d";
    }
    e.style.border = "3px solid #8d0801";
}

function getSessionTitle(session) {
    if (session.data.name)
        return session.data.name;
    else
        return "Anonymous session";
}