
var cy = null; // The variable that holds the cytoscape object.
//var fixedCon = []; // The variable that holds fixed node positions

/**
 * Initalizes the session graph as a cytoscape object with no elements.
 */
function initializeSG() {
    // create an HTML container for the graph in the background page
    //* This page is not rendered, the container's sole purpose is to enable cytospace.js to work properly.
    let container = document.createElement("div");
    // ! This is problematic! 
    container.style.width = container.style.height = "300px"; // random values for width and height.
    document.body.appendChild(container);

    cy = cytoscape({
        container: container,
        style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'label': 'data(title)'
              }
            },
        ],
        ready: function () {
            // ready 1
        }
    });
}

/**
 * Loads the given graph into session graph.
 * @param {Object} cyJson Cytoscape JSON export.
 */
function loadSG(cyJson) {
    cy.json(cyJson);
}

function getCytoscapeJSON(){
    return cy.json(true);
}

function updateNodePosition(nodeId, newPos) {
    console.log("UPDATING", nodeId);
    cy.getElementById(nodeId).position(newPos);
    //addFixedNodes(nodeId, newPos, 0);
   
}

function removeNode(nodeId) {

    console.log("DELETING NODE");
    let node = cy.getElementById(nodeId);
    cy.remove(node);

    // remove the entry from tabUrls
    if (node.data("openTabCount") > 0 ) {
        let nodeUrl = node.data("id");
        tabURLs.forEach((url, tabId) => {
            if(nodeUrl == url)
                tabURLs.delete(tabId);
        });
    }
    return true;
}

function openPage(nodeId) {
    //! This results in an edge because the transition type of the visit caused by this function is "link".
    //TODO find a way to handle this.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: nodeId});
    });
    return true;
}

function openPageInNewTab(nodeId) {
    chrome.tabs.create({url: nodeId});
    return true;
}

function removeEdge(edgeId) {
    //! Bu henüz olmuyo.
    return true;
}

function messageReceived(request, sender, sendResponse) {
    if (request.type == "getCytoscapeJSON") {
        sendResponse(this.getCytoscapeJSON());
    } else if (request.message == "WILLOW_BACKGROUND_UPDATE_NODE_POS") {
        updateNodePosition(request.nodeId, request.newPos);
    } else if (request.message == "WILLOW_BACKGROUND_REMOVE_NODE") {
        removeNode(request.nodeId);
    } else if (request.message == "WILLOW_BACKGROUND_OPEN_PAGE") {
        openPage(request.nodeId);
    } else if (request.message == "WILLOW_BACKGROUND_OPEN_PAGE_IN_NEW_TAB") {
        openPageInNewTab(request.nodeId);
    } else if (request.message == "WILLOW_BACKGROUND_REMOVE_EDGE") {
        removeEdge(request.nodeId);
    }

}


function runLayout(){

    cy.layout({
        
        name: 'fcose',
        quality: "proof",
        fit: true, 
        padding: 30,
        animate: false,
        randomize: false,
        nodeDimensionsIncludeLabels: true,
        packComponents: true,
       
        //contraints
        fixedNodeConstraint: undefined, //fixedCon,
        alignmentConstraint: undefined,
        relativePlacementConstraint: undefined,

        ready: () => {},
        stop: () => {}                 
    }).run();
}


/*
function addFixedNodes(nodeId, newPos, newNode){
    
    if (newNode) {
        runLayout();  //so that the layout can decide its position     
        
        var newPos = {x: cy.getElementById(nodeId).position('x'), y: cy.getElementById(nodeId).position('y')};
        var fixedNode = {
            nodeId : nodeId,
            position: newPos
        };
        fixedCon.push(fixedNode); 

        //cy.getElementById(nodeId).position(newPos);
    }
    else {
      
        fixedCon.forEach(function (item) {
            if (item.nodeId == nodeId)
            {
                found = 1;
                item.nodeId = nodeId;
                item.position.x = newPos.x;
                item.position.y = newPos.y;
            }

        });
    }
   
}*/