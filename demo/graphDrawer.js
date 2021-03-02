let canvas = document.getElementById("canvas");

let cy = cytoscape();

cy.on('dragfree', 'node', function(evt){
    console.log( 'DF: ', evt.target.id(), evt.target.position());

    // update the node position at the background script
    chrome.runtime.sendMessage( {
        message: "WILLOW_BACKGROUND_UPDATE_NODE_POS",
        nodeId: evt.target.id(),
        newPos: evt.target.position()
    })

    // ! A timeout is used temporarily. Need to wait for response from the backgroundç
    setTimeout( () => {
        // notify the other tabs of the change
        chrome.runtime.sendMessage( {
            message: "WILLOW_GRAPH_SYNC_REQUEST",
        })
    }, 100);
});

updateCytoscape();

function updateCytoscape() {
    chrome.runtime.sendMessage( {type : "getCytoscapeJSON"}, function (response) {
        console.log(response);
        cy.mount(canvas);
        cy.json(response);
    });
}


/*****************************************************************************
*******************    Implementation of GraphSyncer   ******************* 
*****************************************************************************/

// listen for Graph sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message != "WILLOW_GRAPH_SYNC_REQUEST") {
            return;
        }
        handleSyncRequest(request);
    }
);

// updates the whole cytoscape instance by requesting the instance from the bacground again
function handleSyncRequest(request) {
    updateCytoscape();
}
