//console.log("alo");

async function loadHistoryMenu() {
    await saveCurrentSession();
    // if a tab contains the history menu, reload that one and switch to it. If not, create a new tab.
    chrome.tabs.query({url: chrome.extension.getURL("/History/HistoryMenu.html")}, function (res) {
        if(res.length > 0) {
            chrome.tabs.reload(res[0].id, {bypassCache:true}, function () {
                chrome.tabs.update(res[0].id, {active: true});
            });
        } else {
            chrome.tabs.create({url: chrome.extension.getURL("/History/HistoryMenu.html")});
        }
    });
}

chrome.tabs.onActivated.addListener( (activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if(tab.url == chrome.extension.getURL("/History/HistoryMenu.html")) {
            loadHistoryMenu();
        }
    })
});

async function loadSessionWithId(id) {
    await saveCurrentSession();
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

//! Duplicate code here, decompose some part of this into a function later.
function renameSessionWithId(id, name) {
    chrome.storage.local.get({sessions: []}, function (result) {
        var sessions = result.sessions;
        if(id == cy.data("id")) {
            cy.data("name", name);
        }
        let found = false;
        for( let i = 0; i < sessions.length; i++) {
            if(sessions[i].data.id == id) {
                sessions[i].data.name = name;
                found = true;
            }
        }
        if(!found)
            console.error("Session with id: " + id + " is not found");
        else {
            // update the stored array
            chrome.storage.local.set({sessions: sessions}, function () {
                //console.log("session renamed! New sessions: ", sessions);
            });
        }
    });
}

function deleteSessionWithId(id) {
    if(id == cy.data("id"))
        return false;
    else {
        chrome.storage.local.get({sessions: []}, function (result) {
            var sessions = result.sessions;
            sessions = sessions.filter( session => {return session.data.id != id});

            chrome.storage.local.set({sessions: sessions}, function () {
                //console.log("session deleted! New sessions: ", sessions);
            });
        });
        return true;
    }
}

function saveCurrentSession() {
    return new Promise( (resolve, reject) => {
        // save the sesssion to chrome's persistent storage
        chrome.storage.local.get({sessions: []}, async function (result) {
            var sessions = result.sessions;

            // save the png export inside data
            applyStyle();
            cy.style().update();            
            cy.data("png", cy.png({full:true}));
            
            // set the last updated data
            var now = new Date();
            var lastAccess = now.getFullYear()+'-'+String((now.getMonth()+1)).padStart(2,'0')+'-'+ String(now.getDate()).padStart(2,'0') + ' at '
                + now.getHours() + "." + String(now.getMinutes()).padStart(2,'0') + "." + String(now.getSeconds()).padStart(2,'0');
            cy.data("lastUpdated", lastAccess);

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
                //console.log("session saved! New sessions: ", sessions);
                resolve();
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message == "WILLOW_HISTORY_LOAD_SESSION") {
            loadSessionWithId(request.id);
        } else if (request.message == "WILLOW_HISTORY_RENAME_SESSION") {
            renameSessionWithId(request.id, request.name);
        } else if (request.message == "WILLOW_HISTORY_DELETE_SESSION"){
            sendResponse( deleteSessionWithId(request.id));
        } else if (request.message == "WILLOW_HISTORY_SHOW") {
            loadHistoryMenu();
        }
    }
);

