
var cy = null; // The variable that holds the cytoscape object.
var fixedCon = []; // The variable that holds fixed node positions

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
    let found = 0;
    cy.getElementById(nodeId).position(newPos);
    fixedCon.forEach(function (item) {
        if (item.nodeId == nodeId)
        {
            found = 1;
            item.nodeId = nodeId;
            item.position.x = newPos.x;
            item.position.y = newPos.y;
        }

    });
    if (found == 0){
        var fixedNode = {
            nodeId : nodeId,
            position: {x: newPos.x, y: newPos.y}
        };
       fixedCon.push(fixedNode);
    }
}

function messageReceived(request, sender, sendResponse) {
    if (request.type == "getCytoscapeJSON") {
        var arr = [this.getCytoscapeJSON(), fixedCon];
        sendResponse(arr);
    } else if (request.message == "WILLOW_BACKGROUND_UPDATE_NODE_POS") {
        updateNodePosition(request.nodeId, request.newPos);
    }
}
