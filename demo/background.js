let tabURLs;        // a Map that holds the URL of the page on each open tab, indexed by tabId's generated by chrome.


chrome.runtime.onInstalled.addListener(function () { // runs when the extension is installed or updated
    initialize();
    addListeners();

    // initializes the data structures of this background page.
    function initialize() {
        tabURLs = new Map();
        sessionGraph = new Map();
    }

    // adds the listeners to relevant chrome events.
    function addListeners() {
        chrome.tabs.onUpdated.addListener(tabUpdated);
        chrome.tabs.onRemoved.addListener(tabRemoved);  
        chrome.runtime.onMessage.addListener(messageReceived);
    }
});

/**
 * The event that fires when a tab is updated.
 * @param {number} tabId        The unique tabId generated by chrome. This is the id used to index tabURLs.
 * @param {object} changeInfo   Changes to the state of the tab. Check https://developer.chrome.com/docs/extensions/reference/tabs/ for info.
 * @param {Tab} tab             The chrome tab object, more info in the link above.
 */
function tabUpdated(tabId, changeInfo, tab) {

    if (changeInfo.url && !changeInfo.url.startsWith("chrome")) { // do not consider the pages that start with chrome, no history is kept for them.
        urlLoaded(tabId, tab.url);
    }
    else if(changeInfo.title) {
        let node = cy.getElementById(tab.url);
        if(node.length>0)
            setTimeout( () => {
                node.data("title", changeInfo.title);

                // ! This seems like the correct place for this. Might need to move somewhere else
                // Notify all tabs of the newly inserted node
                broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST"});
            }, 30);
        /*
         * ChangeInfo contains a title on two different triggers: when the URL changes and when the page's actual title loads.
         * by doing this in the "else", we guarantee that we will get the actual title and not the URL.
         * We wait a bit before doing this to make sure the sesisonGraph actually contains the node.
         */
    }
}

function tabRemoved( tabId, removeInfo) {
    // the page isn't open in that tab anymore
    let node = cy.getElementById(tabURLs.get(tabId));

    if(node.length > 0) //! Sketchy
        node.data( "openTabCount", node.data("openTabCount") - 1); // decrement the openTabCount of the node.

    tabURLs.delete(tabId);
}

/**
 * The event that fires when a new page is loaded in any tab
 * @param {number} tabId    The id of the tab that contains the new page.
 * @param {string} url      The URL of the page.
 */
async function urlLoaded(tabId, url) {
    let node = cy.getElementById(url);
    if (node.length > 0) { //! Sketchy (if there is already a node with this url)
        // the url was opened before, there is a node in the graph with this url.
        // ? If we're going to keep track of all visits (ditch the session tree), the link needs to be added here.
        //update the open tab count
        node.data( "openTabCount", node.data("openTabCount") + 1); // increment the openTabCount of the node.
    } else {
        let favIconUrl = "chrome://favicon/size/64@1x/" + url;
        let node = cy.add({// add the node to the cy graph
            group: 'nodes',
            data: {id: url, title: "title not loaded :(", openTabCount:1, iconURL: favIconUrl},
            position: { x: 200, y: 200 }
        });

        // TEST PURPOSE ---------------
        // apply layout after adding the new node.
        /*
        var layout = cy.elements().layout({
            name: 'circle'
        });
        layout.run();
        */
        // ----------------------------- 
        
        chrome.tabs.get(tabId , function(tab){
            node.title = tab.title; // this is asyncronous but that should be ok.
        });    
    }
    
    // insert the edge if it does not already exist
    if (await lastVisitIsEdge(url)) {
        let sourceURL =  await findActiveNodeURL();
        
        if (cy.edges('edge[source = "' + sourceURL + '"][target = "' + url + '"]').length > 0) {
            // the edge is already in the graph
            /** NOP */
        } else {        
            if (sourceURL) {
                // add the new node as a child.
                cy.add({ group: 'edges', data: {source: sourceURL, target: url} });
            } else {
                console.warn( "The parent of the newly loaded page is not in the session graph.");
            }
        }

    }
    
    // the tab does not contain the old page anymore.
    let oldURL = tabURLs.get(tabId);
    if(oldURL) {
        let oldURLNode = cy.getElementById(oldURL); // decrement the old page's node's open tab count.
        oldURLNode.data("openTabCount", oldURLNode.data("openTabCount") - 1);
    }
    
    // update the URL open in the tab.
    tabURLs.set(tabId, url);

    return null;

    //--------------------------- helper functions --------------------------------
    /**
     * @returns {URL} The node open in the active tab.
     */
    async function findActiveNodeURL() {
        return new Promise ( function (resolve, reject) {
            // request the active tab. 
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // find the corresponding node.
                let URL = tabURLs.get(tabs[0].id);
                resolve (URL);
            });
        });
    }

    async function lastVisitIsEdge(url) {
        return new Promise( function (resolve, reject) {
            // request a list of visits to the url.
            chrome.history.getVisits({ url: url }, function (visitItems) {
                console.log("The page was visited ", visitItems.length, " times.");
                console.log("Last transition type is ", visitItems[visitItems.length - 1].transition);
                // if the new url is last visited by a link, the new page's node is a child of the node this tab is at.
                if (visitItems[visitItems.length - 1].transition == "link" ||
                    visitItems[visitItems.length - 1].transition == "form_submit") {
                    resolve(true);
                } else resolve(false);
            });
        }); 
    }

}
//-----------------------//-----------------------//-----------------------//-----------------------//-----------------------//-----------------------//-----------------------
/**
 * This is just here for experimentation purposes.
 */

let container = document.createElement("div");
container.style.width = container.style.height = 200;
document.body.appendChild(container);

let cy = cytoscape({
    container: container,
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'background-color': '#B3767E',
            'width': '20',
            'height': '20',
            'content': 'data(title)',
            'background-image': 'data(iconURL)',
            'background-image-opacity': '1',
            'background-opacity': '0',
            'background-fit': 'contain',
            'background-clip': 'node'
        })
        .selector('edge')
        .css({
            'line-color': '#F2B1BA',
            'target-arrow-color': '#F2B1BA',
            'width': 2,
            'target-arrow-shape': 'triangle-backcurve',
            'curve-style': 'bezier',    // the default curve style does not support arrows
            'opacity': 0.8
        })
        .selector(':selected')
        .css({
            'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'opacity': 1
        })
        .selector('.faded')
        .css({
            'opacity': 0.25,
            'text-opacity': 0
        }),

    ready: function () {
        // ready 1
    }
});



function getCytoscapeJSON(){
    return cy.json(true);
}

function updateNodePosition(nodeId, newPos) {
    console.log("UPDATING", nodeId);
    cy.getElementById(nodeId).position(newPos);
}

function messageReceived(request, sender, sendResponse) {
    if (request.type == "getCytoscapeJSON") {
        sendResponse(this.getCytoscapeJSON());
    } else if (request.message == "WILLOW_BACKGROUND_UPDATE_NODE_POS") {
        updateNodePosition(request.nodeId, request.newPos);
    }
}