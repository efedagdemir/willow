let canvas = document.getElementById("canvas");

let cy = cytoscape();

cy.on('dragfree', 'node', function (evt) {
    console.log('DF: ', evt.target.id(), evt.target.position());

    // update the node position at the background script
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_UPDATE_NODE_POS",
        nodeId: evt.target.id(),
        newPos: evt.target.position()
    })

    // ! A timeout is used temporarily. Need to wait for response from the backgroundç
    setTimeout(() => {
        // notify the other tabs of the change
        chrome.runtime.sendMessage({
            message: "WILLOW_GRAPH_SYNC_REQUEST",
        })
    }, 100);
});

updateCytoscape();

function updateCytoscape() {
    chrome.runtime.sendMessage({ type: "getCytoscapeJSON" }, function (response) {
        console.log(response);
        cy.mount(canvas);
        cy.json(response);

        applyContextMenu();
        applyStyle();

        /**
         * This implementation is mainly for reference. It may or may not make sense to
         * set the zoom level / camera position as the Cytoscape instance is being updated.
         */
        adjustViewport();
    });
}

/**
 * Sets the zoom level and the camera position to center the graph.
 */
function adjustViewport() {
    cy.resize() // make sure that cytoscape is up-to-date with its container size.

    /**
     * We have a few alternatives, we can choose any and comment out the rest
     * according to what is needed.
     */

    // (1): Center Graph
    // Bring the center of the graph to the center of the canvas.
    cy.center();

    // (2): Fit Graph
    // Adjust the zoom level to fit the whole graph in addition to centering.
    //cy.fit();

    // (3): Center Origin
    // Set camera position manually. Bring origin to the center. 
    // Might be more useful in handlling fixed-placed nodes.
    /*
    cy.pan({
        x: cy.width() / 2,
        y: cy.height() / 2,
    });
    */

    // (4): Fit Origin
    // Adjust zoom level as well as centering the origin.
    /*
    cy.fit();
    cy.pan({
        x: cy.width() / 2,
        y: cy.height() / 2,
    });*/
}

function applyStyle() {
    cy.style()
        .selector('node')
        .style({
            'background-color':
                function (ele) {
                    if (ele.data('openTabCount') > 0)
                        return '#50b46e';
                    else
                        return '#808080';
                },
            'border-width': 2, //added border for icons
            'border-opacity': 1,
            'border-color':
                function (ele) {
                    if (ele.data('openTabCount') > 0)
                        return '#50b46e';
                    else
                        return '#495057';
                },
            'width': '20',
            'height': '20',
            'content': 'data(title)',
            'text-wrap': 'wrap',
            'text-max-width': '170px',
            'text-justification': 'center',
            'background-image': 'data(iconURL)',
            'background-image-opacity': '1',
            'background-opacity': '0',
            'background-fit': 'contain',
            'background-clip': 'node',
            'font-family' : 'Open Sans',
        })
        .selector('edge')
        .style({
            'line-color': '#ab0321',
            'target-arrow-color': '#ab0321',
            'width': 2.5,
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
}

function applyContextMenu() {
    var contextMenu = cy.contextMenus({
        menuItems: [
            {
                id: 'remove',
                content: 'Remove node',
                tooltipText: 'Remove node from graph',
                selector: 'node',
                onClickFunction: function (event) {
                    /*var target = event.target || event.cyTarget;
                    removed = cy.remove(target);
                    console.log(removed + "is removed");   */
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    removed = cy.remove(target);
                    console.log(removed + "is removed");
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_REMOVE_NODE",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    })

                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'open',
                content: 'Open page',
                tooltipText: 'Open page in the active tab',
                selector: 'node',
                onClickFunction: function (event) {
                    /*var target = event.target || event.cyTarget;
                    removed = cy.remove(target);
                    console.log(removed + "is removed");   */
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_OPEN_PAGE",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    })

                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'open-in-new-tab',
                content: 'Open page in new tab',
                tooltipText: 'Open page in new tab',
                selector: 'node',
                onClickFunction: function (event) {
                    /*var target = event.target || event.cyTarget;
                    removed = cy.remove(target);
                    console.log(removed + "is removed");   */
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_OPEN_PAGE_IN_NEW_TAB",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    })

                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'remove-edge',
                content: 'Remove edge',
                tooltipText: 'Remove the edge between the nodes',
                selector: 'node',
                onClickFunction: function (event) {
                    /*var target = event.target || event.cyTarget;
                    removed = cy.remove(target);
                    console.log(removed + "is removed");   */
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_REMOVE_EDGE",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    })

                },
                show: true,
                coreAsWell: true
            }

        ],
        submenuIndicator: { src: 'node_modules/cytoscape-context-menus/assets/submenu-indicator-default.svg', width: 12, height: 12 }

    });

    cy.on('cxttap', function () {
        contextMenu.showMenuItem('remove');
    });

    // ! WIP (Work in progress)
    /*var allSelected = function (type) {
        if (type == 'node') {
          return cy.nodes().length == cy.nodes(':selected').length;
        }
        else if (type == 'edge') {
          return cy.edges().length == cy.edges(':selected').length;
        }
        return false;
    }

    cy.on('cxttap', function(event) {
        if (allSelected('node')) {
            contextMenu.hideMenuItem('remove-edge');
            contextMenu.showMenuItem('remove');
            contextMenu.showMenuItem('open');
            contextMenu.showMenuItem('open-in-new-tab');
        }/*
        else if (allSelected('edge')) {
            contextMenu.showMenuItem('remove-edge');
            contextMenu.hideMenuItem('remove');
            contextMenu.hideMenuItem('open');
            contextMenu.hideMenuItem('open-in-new-tab');
        }
        else {
            contextMenu.hideMenuItem('remove-edge');
            contextMenu.hideMenuItem('remove');
            contextMenu.hideMenuItem('open');
            contextMenu.hideMenuItem('open-in-new-tab');
        }
      });*/


}

/*****************************************************************************
*******************    Implementation of GraphSyncer   ******************* 
*****************************************************************************/

// listen for Graph sync requests
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "WILLOW_GRAPH_SYNC_REQUEST") {
            handleSyncRequest(request);
        } else if (request.message == "WILLOW_GRAPH_VIEWPORT_ADJ") {
            console.log("Adjusting viewport");
            adjustViewport();
        } 
        
    }
);

// updates the whole cytoscape instance by requesting the instance from the bacground again
function handleSyncRequest(request) {
    updateCytoscape();
}
