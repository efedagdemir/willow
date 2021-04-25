let previewPane = document.getElementById("previewPane");
let previewImg = document.getElementById("previewImg");
let sessionList = document.getElementById("sessionList");
let curTitle = document.getElementById("curTitle");
let curSession;

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

/**
 * 
 * @param {Object} session A cytoscape export.
 */
function addSessionElements (session) {
    console.log(session);
    // --- create the html elements ---
    let rootDiv = document.createElement("div");
    let titleDiv = document.createElement("div");
    let restoreBtnDiv = document.createElement("div");
    let restoreBtn = document.createElement("button");
    let renameBtnDiv = document.createElement("div");
    let renameBtn = document.createElement("button");
    let deleteBtnDiv = document.createElement("div");
    let deleteBtn = document.createElement("button");
        //let image = document.createElement("img");

    // --- set the properties ---
    rootDiv.className = "historyElement";
    titleDiv.className = "label";
    restoreBtnDiv.className = "opt";
    renameBtnDiv.className = "opt";
    deleteBtnDiv.className = "opt";

    restoreBtn.title = "Restore this session";
    restoreBtn.innerHTML = "Restore";
    renameBtn.title = "Rename this session";
    renameBtn.innerHTML = "Rename";
    deleteBtn.title = "Delete this session from your history";
    deleteBtn.innerHTML = "Delete";

    titleDiv.innerHTML = "<b>" + getSessionTitle(session) + "</b>";
    
    restoreBtnDiv.appendChild(restoreBtn);
    renameBtnDiv.appendChild(renameBtn);
    deleteBtnDiv.appendChild(deleteBtn);
    rootDiv.appendChild(restoreBtnDiv);
    rootDiv.appendChild(renameBtnDiv);
    rootDiv.appendChild(deleteBtnDiv);
    rootDiv.appendChild(titleDiv);
    //sessionDiv.appendChild(image);
    sessionList.appendChild(rootDiv);
    
    // --- add listeners ---
    rootDiv.addEventListener("mouseover", function() {
        curSession = session;
        updatePreview();
    });
    restoreBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage({ message: "WILLOW_HISTORY_LOAD_SESSION", id: session.data.id});
    });
    renameBtn.addEventListener("click", function() {
        let name = prompt("Enter new name:");
        chrome.runtime.sendMessage( {message: "WILLOW_HISTORY_RENAME_SESSION", id: session.data.id, name: name});
        titleDiv.innerHTML = "<b>" + name + "</b>";
        session.data.name = name;    // javascript pls remember this
        curSession = session;
        updatePreview();
    });
    deleteBtn.addEventListener("click", function () {
        // TODO
        alert("GETCHO ASS UP CEM!");
    });
}

function updatePreview() {
    previewPane.style.display = ""; // default in case previously none'd
    previewImg.setAttribute("src", curSession.data.png);
    curTitle.innerHTML = getSessionTitle(curSession);
}

function clearPreview() {
    previewPane.style.display = "none";
}

function getSessionTitle(session) {
    if (session.data.name)
        return session.data.name;
    else
        return session.data.lastUpdated;
}