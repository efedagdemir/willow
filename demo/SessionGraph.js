
var cy = null; // The variable that holds the cytoscape object.

/**
 * Initalizes the session graph as a cytoscape object with no elements.
 */
function initializeSG() {
    // create an HTML container for the graph in the background page
    //* This page is not rendered, the container's sole purpose is to enable cytospace.js to work properly.
    let container = document.createElement("div");
    container.style.width = container.style.height = 200; // random values for width and height.
    document.body.appendChild(container);

    cy = cytoscape({
        container: container,
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
}

function removeNode(nodeId) {
    /*
    console.log("DELETING NODE");
    let node = cy.getElementById(nodeId);
    cy.remove(node);
    */
   return true;
}

function openPage(nodeId) {
   return true;
}

function openPageInNewTab(nodeId) {
   return true;
}

function removeEdge(nodeId) {
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