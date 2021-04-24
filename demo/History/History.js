initializeSG();
console.log("alo");

function loadHistoryMenu() {
    chrome.tabs.create({url: chrome.extension.getURL("/History/HistoryMenu.html")});
}

async function loadSessionWithId(id) {
    await saveSG();
    chrome.storage.local.get({sessions: []}, function (result) {
        var sessions = result.sessions;

        let found = false;
        for( let i = 0; i < sessions.length; i++) {
            if(sessions[i].data.id == id) {
                importJSON(sessions[i]);
                found = true;
            }
        }
        if(!found)
            console.error("Session with id: " + id + " is not found");
    });
}

function saveSG() {
    return new Promise( (resolve, reject) => {
        // save the sesssion to chrome's persistent storage
        chrome.storage.local.get({sessions: []}, function (result) {
            var sessions = result.sessions;

            let id = cy.data("id");
            let found = false;
            for( let i = 0; i < sessions.length; i++) {
                if(sessions[i].data.id == id) {
                    sessions[i] = cy.json();
                    found = true;
                }
            }
            if(!found)
                sessions.push(cy.json());
            
            // set the new array value to the same key
            chrome.storage.local.set({sessions: sessions}, function () {
                console.log("session saved! New sessions: ", sessions);
                resolve();
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message == "WILLOW_HISTORY_LOAD_ID") {
            loadSessionWithId(request.id);
        }
    }
);

