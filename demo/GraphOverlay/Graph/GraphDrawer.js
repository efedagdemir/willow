let canvas = document.getElementById("canvas");
let cy = cytoscape();
cy.mount(canvas);
let contextMenuApplied = false;
updateCytoscape();
syncViewport();

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

cy.on("viewport", onViewport);


function onViewport(event) {
    console.log("VIEWPORT EVENT FIRED");
    chrome.storage.local.set({
        WILLOW_VIEWPORT: {
            zoom: cy.zoom(),
            pan: cy.pan()
        }
    }, function() {
        chrome.runtime.sendMessage({
             message: "WILLOW_VIEWPORT_SYNC_REQUEST",
        });
    }); 
}

function updateCytoscape() {
    chrome.runtime.sendMessage({ type: "getCytoscapeJSON" }, function (response) {
        console.log("RESPONSE RECEIVED");
        console.log(response);
        // save current viewport to restore after response json is loaded
        let tmp = {
            zoom: cy.zoom(),
            pan: cy.pan()
        }
        response.pan = tmp.pan;
        response.zoom = tmp.zoom;
        cy.json(response);

        applyStyle();

        if(!contextMenuApplied) {
            applyContextMenu();
            contextMenuApplied = true;
        }
    });
}


/**
 * Sets the zoom level and the camera position to center the graph.
 */
 function centerViewport() {
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

function syncViewport() {
    chrome.storage.local.get(["WILLOW_VIEWPORT"], function (res) {
        console.log(res.WILLOW_VIEWPORT);
        cy.removeListener("viewport"); // disable to avoid cycles
        cy.viewport(res.WILLOW_VIEWPORT);
        cy.on("viewport", onViewport);  // re-enable 
    });
}

function applyStyle() {
    cy.style()
        .selector('node')
        .style({
            'width': 'data(width)',
            'height': 'data(width)',
            'background-color':
                function (ele) {
                    if (ele.data('openTabCount') > 0)
                        return '#50b46e';
                    else
                        return '#808080';
                },
            'border-width': 2, 
            'border-opacity': 1,
            'border-color':'data(border_color)',
            'content': function (ele) {
                var limit = 45
                if (ele.data('title').length > limit){
                    var shortened = ele.data('title').substring(0,limit-3);
                    shortened = shortened + "...";
                    return shortened;
                }
                else
                    return ele.data('title');
            },
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
        evtType: 'cxttap',
        menuItems: [
            {
                id: 'open',
                content: 'Open page',
                tooltipText: 'Open page in the active tab',
                selector: 'node',
                hasTrailingDivider: true,
                onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_OPEN_PAGE",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    });
                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'open-in-new-tab',
                content: 'Open page in new tab',
                tooltipText: 'Open page in new tab',
                selector: 'node',
                hasTrailingDivider: true,
                onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_OPEN_PAGE_IN_NEW_TAB",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    });
                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'change-border-color',
                content: 'Change border color',
                tooltipText: 'Change the color around the node',
                selector: 'node',
                hasTrailingDivider: true,
                submenu: [
                    {
                        id: 'color-red',
                        content: 'Red',
                        tooltipText: 'Red',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('border-color', '#E81414');
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_BORDER_COLOR",
                                nodeId: id,
                                color: "red"
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: 'color-green',
                        content: 'Green',
                        tooltipText: 'Green',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('border-color', '#50b46e');
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_BORDER_COLOR",
                                nodeId: id,
                                color: "green"
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: 'color-blue',
                        content: 'Blue',
                        tooltipText: 'Blue',
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('border-color', '#1444E8');
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_BORDER_COLOR",
                                nodeId: id,
                                color: "blue"
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    }
                ]

            },
            {
                id: 'change-node-size',
                content: 'Change node size',
                tooltipText: 'Change the size of the node',
                selector: 'node',
                hasTrailingDivider: true,
                submenu: [
                    {
                        id: '12',
                        content: 'Extra small',
                        tooltipText: 'Extra small',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('width', 12);
                            target.style('height', 12);
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
                                nodeId: id,
                                size: 12
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: '20',
                        content: 'Small',
                        tooltipText: 'Small',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('width', 20);
                            target.style('height', 20);
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
                                nodeId: id,
                                size: 20
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: '28',
                        content: 'Medium',
                        tooltipText: 'Medium',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('width', 28);
                            target.style('height', 28);
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
                                nodeId: id,
                                size: 28
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: '36',
                        content: 'Large',
                        tooltipText: 'Large',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('width', 36);
                            target.style('height', 36);
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
                                nodeId: id,
                                size: 36
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                    {
                        id: '44',
                        content: 'Extra large',
                        tooltipText: 'Extra large',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            let target = event.target || event.cyTarget;
                            let id = target.id();
                            target.style('width', 44);
                            target.style('height', 44);
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
                                nodeId: id,
                                size: 44
                            });
                            chrome.runtime.sendMessage({
                                message: "WILLOW_GRAPH_SYNC_REQUEST",
                            });
                        }
                    },
                ]

            },
            {
                id: 'remove',
                content: 'Remove node',
                tooltipText: 'Remove node from graph',
                selector: 'node',
                onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    removed = cy.remove(target);
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_REMOVE_NODE",
                        nodeId: id
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    });
                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'remove-edge',
                content: 'Remove edge',
                tooltipText: 'Remove the edge between the nodes',
                selector: 'edge',
                onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    let sourceURL = target.source();
                    let targetURL = target.target();
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_REMOVE_EDGE",
                        source: sourceURL,
                        target: targetURL
                    });
                    chrome.runtime.sendMessage({
                        message: "WILLOW_GRAPH_SYNC_REQUEST",
                    })

                },
                show: true,
                coreAsWell: true
            }

        ],
        submenuIndicator: {src: '/node_modules/cytoscape-context-menus/assets/submenu-indicator-default.svg', width: 12, height: 12}

    });

    cy.on('cxttap', function (event) {
        var evtTarget = event.target;
        if (evtTarget === cy){
            console.log("target is the background");
            contextMenu.hideMenuItem('open');
            contextMenu.hideMenuItem('open-in-new-tab');
            contextMenu.hideMenuItem('remove');
            contextMenu.hideMenuItem('remove-edge');
            contextMenu.hideMenuItem('change-border-color');
            contextMenu.hideMenuItem('change-node-size');
        }
        else if (evtTarget.isNode()){
            console.log("target is a node");
            contextMenu.showMenuItem('open');
            contextMenu.showMenuItem('open-in-new-tab');
            contextMenu.showMenuItem('remove');
            contextMenu.showMenuItem('change-border-color');
            contextMenu.showMenuItem('change-node-size');

            contextMenu.hideMenuItem('remove-edge');
        }
        else if (evtTarget.isEdge()){
            console.log("target is an edge");
            contextMenu.showMenuItem('remove-edge');

            contextMenu.hideMenuItem('open');
            contextMenu.hideMenuItem('open-in-new-tab');
            contextMenu.hideMenuItem('remove');
            contextMenu.hideMenuItem('change-border-color');
            contextMenu.hideMenuItem('change-node-size');
        }
    });

}

/*****************************************************************************
*******************    Implementation of GraphSyncer   ******************* 
*****************************************************************************/

// listen for Graph sync requests
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "WILLOW_GRAPH_SYNC_REQUEST") {
            handleSyncRequest(request);
        } else if (request.message == "WILLOW_GRAPH_VIEWPORT_CENTER") {
            centerViewport();
        } else if (request.message == "WILLOW_VIEWPORT_SYNC_REQUEST") {
            syncViewport();
        }
        
    }
);

// updates the whole cytoscape instance by requesting the instance from the bacground again
function handleSyncRequest(request) {
    updateCytoscape();
}
