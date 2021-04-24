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
    if (session.data.name)
        title.innerHTML = session.data.name;
    else
        title.innerHTML = session.data.lastUpdated;

    loadButton.addEventListener("click", function () {
        chrome.runtime.sendMessage({ message: "WILLOW_HISTORY_LOAD_SESSION", id: session.data.id});
    });

    renameButton.addEventListener("click", function() {
        let name = prompt("Enter new name:");
        chrome.runtime.sendMessage( {message: "WILLOW_HISTORY_RENAME_SESSION", id: session.data.id, name: name});
        title.innerHTML = name;
    });
}
