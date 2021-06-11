// These three lines run whenever chrome loads.
let tabURLs;            // a Map that holds the URL of the page on each open tab, indexed by tabId's generated by chrome.
let openingFromGraph;   // a Map that hanldes a very specific exception. Keys here map to "true" iff they are the urls being opened from the willow overlay.


initialize();
addListeners(); //

// initializes the data structures of this background page.
function initialize() {
    tabURLs = new Map();
    openingFromGraph = new Map();
    initializeSG();
}

// adds the listeners to relevant chrome events.
/*
 * NOTE: Listers are added here solely because this is the last page to load and thus has all the other functions in scope.
 *       A better implementation would be to have a separate message handler script which loads last.
 */
function addListeners() {
    chrome.tabs.onUpdated.addListener(tabUpdated);
    chrome.tabs.onRemoved.addListener(tabRemoved);  
    chrome.runtime.onMessage.addListener(messageReceived);
    chrome.windows.onRemoved.addListener(windowClosed);
    chrome.runtime.onInstalled.addListener( () => chrome.storage.local.set({sessions: [], nextId: 0}));
}

function windowClosed() {
    saveCurrentSession();
}

/**
 * The event that fires when a tab is updated.
 * @param {number} tabId        The unique tabId generated by chrome. This is the id used to index tabURLs.
 * @param {object} changeInfo   Changes to the state of the tab. Check https://developer.chrome.com/docs/extensions/reference/tabs/ for info.
 * @param {Tab} tab             The chrome tab object, more info in the link above.
 */
function tabUpdated(tabId, changeInfo, tab) {
    
    
    if (tabURLs.get(tabId) && changeInfo.url != undefined && changeInfo.url.startsWith("chrome")){
        let node = cy.getElementById(tabURLs.get(tabId));
        tabURLs.set(tabId, changeInfo.url);
        node.data( "openTabCount", node.data("openTabCount") - 1); 
        broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST", notifyActiveTab: true});
    }
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
                broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST", notifyActiveTab: true});
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

    if(node.length > 0) { //! Sketchy
        node.data( "openTabCount", node.data("openTabCount") - 1); // decrement the openTabCount of the node.
        broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST", notifyActiveTab: true});
    }
    tabURLs.delete(tabId);
}

/**
 * The event that fires when a new page is loaded in any tab
 * @param {number} tabId    The id of the tab that contains the new page.
 * @param {string} url      The URL of the page.
 */
async function urlLoaded(tabId, url) {
    let shouldRunLayout = false;
    let node = cy.getElementById(url);
    let newNode = false; // whether or not the node is newly discovered.

    if (node.length > 0) { //! Sketchy (if there is already a node with this url)
        // the url was opened before, there is a node in the graph with this url.
        // ? If we're going to keep track of all visits (ditch the session tree), the link needs to be added here.
        //update the open tab count
        node.data( "openTabCount", node.data("openTabCount") + 1); // increment the openTabCount of the node.
    } else {
        shouldRunLayout = true;
        let favIconUrl = "chrome://favicon/size/64@1x/" + url;
        let node = cy.add({// add the node to the cy graph
            group: 'nodes',
            data: {id: url, title_size: '20px', title: "Title loading..", width: 35, border_color: "#808080", openTabCount:1, iconURL: favIconUrl, comment: ""},
            
        });
        newNode = true;

        //! temp
        applyStyle();
        cy.style().update();
        cy.data("png", cy.png({full:true}));

        // get the page's title and add it. this happens asynchronously. //TODO this could be formatted better.
        const getTitle = (url) => {  
            return fetch(url)
              .then((response) => response.text())
              .then((html) => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                const title = doc.querySelectorAll('title')[0];
                return title.innerText;
            });
        };
        
        getTitle(url).then( (res => {node.data("title", res);}));
    }
    
    // insert the edge if it does not already exist
    if (await lastVisitIsEdge(url)) {
        shouldRunLayout = true;
        let sourceURL =  await findActiveNodeURL();
        
        if (cy.edges('edge[source = "' + sourceURL + '"][target = "' + url + '"]').length > 0) {
            // the edge is already in the graph
            /** NOP */
        } else {        
            if (cy.getElementById(sourceURL).length > 0) { // if the sourceURL has a node in the graph.
                // add the new node as a child.
                let newEdge = cy.add({ group: 'edges', data: {source: sourceURL, target: url} });
                if(newNode)
                    newEdge.data("discovering", true);
            } else {
                //console.warn( "The parent of the newly loaded page is not in the session graph.");
            }
        }
    }
    
    if(shouldRunLayout) {
        runLayout();


        var instance = cy.layoutUtilities( 
        {    idealEdgeLength: 50,        //10
                offset: 20,                 //10
                
                desiredAspectRatio: 1,
                polyominoGridSizeFactor: 1,
                utilityFunction: 1,
                componentSpacing: 30        //10
            });
        
        instance.placeNewNodes(cy.getElementById(url));  
        runLayout();
        //trial 
        var components = cy.elements().components();
        var subgraphs = [];
        components.forEach(function (component) {
        var subgraph = {};
        subgraph.nodes = [];
        subgraph.edges = [];

        component.edges().forEach(function (edge) {
            var boundingBox = edge.boundingBox();
            subgraph.edges.push({ startX: boundingBox.x1, startY: boundingBox.y1, endX: boundingBox.x2, endY: boundingBox.y2 });
        });
        component.nodes().forEach(function (node) {
            var boundingBox = node.boundingBox();
            subgraph.nodes.push({ x: boundingBox.x1, y: boundingBox.y1, width: boundingBox.w, height: boundingBox.h });
        });

        subgraphs.push(subgraph);
        });

        var result = instance.packComponents(subgraphs);
        components.forEach(function (component, index) {
            component.nodes().layout({
            name: 'preset',
            animate: false,
            fit: false,
            transform: (node) => {
                let position = {};
                position.x = node.position('x') + result.shifts[index].dx;
                position.y = node.position('y') + result.shifts[index].dy;
                return position;
            }
            }).run();
        });
    }
    //end of trial*/

    

    // the tab does not contain the old page anymore.
    let oldURL = tabURLs.get(tabId);
    if(oldURL && !oldURL.startsWith("chrome")) {
        let oldURLNode = cy.getElementById(oldURL); // decrement the old page's node's open tab count.
        oldURLNode.data("openTabCount", oldURLNode.data("openTabCount") - 1);
    }
    
    // update the URL open in the tab.
    tabURLs.set(tabId, url);

    broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST", notifyActiveTab: true});
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
        // Handle the exceptional case.
        if(openingFromGraph.get(url)) {
            openingFromGraph.delete(url);
            return false;
        }
        return new Promise( function (resolve, reject) {
            // request a list of visits to the url.
            chrome.history.getVisits({ url: url }, function (visitItems) {
                ////console.log(visitItems);
                ////console.log("The page was visited ", visitItems.length, " times.");
                ////console.log("Last transition type is ", visitItems[visitItems.length - 1].transition);
                
                // if the new url is last visited by "generated", we find that in the second to last entry.
                if (visitItems.length >= 2 && visitItems[visitItems.length - 2].transition == "generated")
                    resolve(false);
                // if the new url is last visited by a link, the new page's node is a child of the node this tab is at.
                if (visitItems[visitItems.length - 1].transition == "link" ||
                    visitItems[visitItems.length - 1].transition == "form_submit") {
                    resolve(true);
                } else resolve(false);
            });
        }); 
    }
}
