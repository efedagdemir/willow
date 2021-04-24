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
    let button = document.createElement("button");
    sessionDiv.appendChild(title);
    sessionDiv.appendChild(image);
    sessionDiv.appendChild(button);
    sessionList.appendChild(sessionDiv);

    // apply the styles (possibly)
        // not yet

    // set the properties
    button.innerHTML = "Load";
    image.setAttribute("src", session.data.png);
    title.innerHTML = "Session with ID " + session.data.id;

    button.addEventListener("click", function () {
        chrome.runtime.sendMessage({ message: "WILLOW_HISTORY_LOAD_ID", id: session.data.id});
    });
}
