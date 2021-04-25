let sessionList = document.getElementById("sessionList");

initialize();

function initialize() {
    // add session elements for all saved sessions.
    chrome.storage.local.get( {sessions:[]}, function(res) {
        res.sessions.forEach( session => {
            addSessionElements(session);
        });
    });
}

/**
 * 
 * @param {Object} session A cytoscape export.
 */
function addSessionElements (session) {
    console.log(session);
    // add the html elements
    let rootDiv = document.createElement("div");
    let titleDiv = document.createElement("div");
    let restoreBtnDiv = document.createElement("div");
    let restoreBtn = document.createElement("button");
    let renameBtnDiv = document.createElement("div");
    let renameBtn = document.createElement("button");
        //let image = document.createElement("img");

    // set the properties
    rootDiv.className = "historyElement";
    titleDiv.className = "label";
    restoreBtnDiv.className = "opt";
    renameBtnDiv.className = "opt";

    restoreBtn.title = "Restore this session";
    restoreBtn.innerHTML = "Restore";
    renameBtn.title = "Rename this session";
    renameBtn.innerHTML = "Rename";

    //image.setAttribute("src", "https://icons.iconarchive.com/icons/paomedia/small-n-flat/256/sign-right-icon.png");
    if (session.data.name)
        titleDiv.innerHTML = "<b>" + session.data.name + "</b>";
    else
        titleDiv.innerHTML = session.data.lastUpdated;
    
    restoreBtnDiv.appendChild(restoreBtn);
    renameBtnDiv.appendChild(renameBtn);
    rootDiv.appendChild(restoreBtnDiv);
    rootDiv.appendChild(renameBtnDiv);
    rootDiv.appendChild(titleDiv);
    //sessionDiv.appendChild(image);
    sessionList.appendChild(rootDiv);
    
    restoreBtn.addEventListener("click", function () {
        alert("HELLO1");
        chrome.runtime.sendMessage({ message: "WILLOW_HISTORY_LOAD_SESSION", id: session.data.id});
    });

    renameBtn.addEventListener("click", function() {
        alert("HELLO2");
        let name = prompt("Enter new name:");
        chrome.runtime.sendMessage( {message: "WILLOW_HISTORY_RENAME_SESSION", id: session.data.id, name: name});
        titleDiv.innerHTML = name;
    });
}

//--------------------------------------------------------------------------------
/*
let sessionList = document.getElementById("sessionList");

initialize();

function initialize() {
    // add session elements for all saved sessions.
    chrome.storage.local.get( {sessions:[]}, function(res) {
        res.sessions.forEach( session => {
            addSessionElements(session);
        });
    });
} */

/**
 * 
 * @param {Object} session A cytoscape export.
 */
/*
function addSessionElements (session) {
    console.log(session);
    // add the html elements
    let sessionDiv = document.createElement("div");
    let title = document.createElement("h1");
    let image = document.createElement("img");
    let loadButton = document.createElement("button");
    let renameButton = document.createElement("button");

    sessionDiv.appendChild(title);
    sessionDiv.appendChild(image);
    sessionDiv.appendChild(loadButton);
    sessionDiv.appendChild(renameButton);
    sessionList.appendChild(sessionDiv);

    // apply the styles (possibly)
        // not yet

    // set the properties
    loadButton.innerHTML = "Load";
    renameButton.innerHTML = "Rename";
    image.setAttribute("src", session.data.png);
    

    
}
*/