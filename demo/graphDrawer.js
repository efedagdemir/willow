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
        cy.json(response[0]);
      
        applyStyle(response[1]);
    });
    
}

function applyStyle(fixedResponse){
    cy.style()       
      .selector('node')
      .style({
            'background-color': 
                function(ele) {      
                    if (ele.data('openTabCount') > 0)   
                        return '#50b46e';
                    else 
                        return '#808080';
                },
            'border-width': 3, //added border for icons
            'border-opacity': 1,
            'border-color': 
                function(ele) {
                    if (ele.data('openTabCount') > 0)   
                        return '#50b46e';
                    else 
                        return '#808080';
                },
            'width': '20',
            'height': '20',
            'content': 'data(title)',
            'text-wrap': 'wrap',
            'text-max-width': '170px',
            'text-justification':'center',
            'background-image': 'data(iconURL)',
            'background-image-opacity': '1',
            'background-opacity': '0',
            'background-fit': 'contain',
            'background-clip': 'node'
        })
        .selector('edge')
        .style({
            'line-color': '#F2B1BA',
            'target-arrow-color': '#F2B1BA',
            'width': 2,
            'target-arrow-shape': 'triangle-backcurve',
            'curve-style': 'bezier',    // the default curve style does not support arrows
            'opacity': 0.8
        })
        .selector(':selected')
        .style({
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
        })
        .update();
        
        let layout = cy.layout({
            name: 'fcose',
            quality: "proof",
            fit: true, //??
            padding: 30,
            animate: false,
            randomize: false,
            nodeDimensionsIncludeLabels: true,
           
            //contraints
            fixedNodeConstraint: fixedResponse,
            alignmentConstraint: undefined,
            relativePlacementConstraint: undefined,

            ready: () => {},
            stop: () => {
               this.fit = true; //??
            }                 
        });
            
        layout.run();
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
