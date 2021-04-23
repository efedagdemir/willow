/**
 * !!!! An Issue: it seems that the ctx menu options do not think about the sync
 * ! problem at all.
 */

let canvas = document.getElementById("canvas");
let cy = cytoscape();
cy.mount(canvas);
let contextMenuApplied = false;
let hoverOverApplied = false;
updateCytoscape();
syncViewport();

cy.on('dragfree', 'node', function (evt) {
    // update the node position at the background script
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_UPDATE_NODE_POS",
        nodeId: evt.target.id(),
        newPos: evt.target.position()
    })
});

cy.on("viewport", onViewport);


function onViewport(event) {
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
        console.log(JSON.stringify(response));
        // save current viewport to restore after response json is loaded
        let tmp = {
            zoom: cy.zoom(),
            pan: cy.pan()
        }
        response.pan = tmp.pan;
        response.zoom = tmp.zoom;
        cy.json(response);

        applyStyle();
        cy.style().update();

        if(!contextMenuApplied) {
            applyContextMenu();
            contextMenuApplied = true;
        }
        if(!hoverOverApplied) {
            applyHoverOver();
            hoverOverApplied = true;
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
            'border-width': 3, 
            'border-height': 'data(width)',
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
            'background-image': function (ele) {
                console.log("icon is:" + ele.data('iconURL'));
                if (ele.data('openTabCount') > 0 ) 
                    return [ele.data('iconURL'), 'active-color4.png'];
                else 
                    return ele.data('iconURL');
            },
            'background-image-containment': ['inside', 'over'],
            'background-width': ['100%', '20%'],
            'background-height': ['100%', '20%'],
            'background-position-x': ['0px', '-10px'],
            'background-position-y':['0px', '3px'],
            'background-image-opacity': ['1', '1'],
            'background-clip': ['node', 'none'],
            'bounds-expansion': ['0', '10'],
            'font-family' : 'Open Sans',
        })
        .selector('edge')
        .style({
            'line-color': '#8d0801', /*#ab0321*/
            'target-arrow-color': '#8d0801',
            'line-style':  function (ele) {
                if(ele.data("discovering") == true){
                    return 'solid';
                }
                else{
                    return 'dashed';
                }
                
            },
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
        .selector('.hovered')
        .css({
            content : 'data(title)',
            'text-wrap': 'wrap',
            'text-max-width': '170px',
            'text-justification': 'center',
            'font-family' : 'Open Sans',  
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
            /*BURADASIN SEZİN */
            {
                id: 'comment',
                content: 'Notes',
                tooltipText: 'See notes',
                selector: 'node',
                hasTrailingDivider: true,
                onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    let id = target.id();
                    let node = cy.getElementById(id);
                    console.log("Node comment is ", node.data("comment"));
                    
                    var modal = document.getElementById("myModal");
                    var span = document.getElementsByClassName("close")[0];
                    
                        
                    document.getElementById("comments").value = node.data("comment");
                     
                    modal.style.display = "block";
                    modal.draggable = 'true';
                   // When the user clicks on <span> (x), close the modal
                    span.onclick = function() {
                        let comment_txt = document.getElementById("comments").value;
                        modal.style.display = "none";
                        node.data("comment",comment_txt);
                        chrome.runtime.sendMessage({
                            message: "WILLOW_ADD_COMMENT",
                            nodeId: id,
                            comment: comment_txt
                        });
                        
                        chrome.runtime.sendMessage({
                            message: "WILLOW_GRAPH_SYNC_REQUEST",
                        });
                    }
   
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
                        image: {src: "red-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#d50000', 'red')
                        }
                    },
                    {
                        id: 'color-pink',
                        content: 'Pink',
                        tooltipText: 'Pink',
                        hasTrailingDivider: true,
                        image: {src: "pink-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#ed539e', 'pink')
                        }
                    },
                    {
                        id: 'color-yellow',
                        content: 'Yellow',
                        tooltipText: 'Yellow',
                        hasTrailingDivider: true,
                        image: {src: "yellow-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#f6b126', 'yellow')
                        }
                    },
                    {
                        id: 'color-green',
                        content: 'Green',
                        tooltipText: 'Green',
                        hasTrailingDivider: true,
                        image: {src: "green-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#49a84d', 'green')
                        }
                    },
                    {
                        id: 'color-purple',
                        content: 'Purple',
                        tooltipText: 'Purple',
                        hasTrailingDivider: true,
                        image: {src: "purple-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#9424aa', 'purple')
                        }
                    },
                    {
                        id: 'color-blue',
                        content: 'Blue',
                        tooltipText: 'Blue',
                        hasTrailingDivider: true,
                        image: {src: "blue-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#0388e7', 'blue')
                        }
                    },
                    {
                        id: 'color-black',
                        content: 'Black',
                        tooltipText: 'Black',
                        image: {src: "black-color.png", width: 10, height: 10, x: 6, y: 4},
                        onClickFunction: function (event){
                            changeNodeColor(event, '#000000', 'black')
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
                        id: 'arrange-size',
                        content: 'Arrange size',
                        tooltipText: 'Arrange size',
                        hasTrailingDivider: true, 
                        submenu: [
                            
                            {
                                id: 'increase-size',
                                content: 'Increase size',
                                tooltipText: 'Increase size',
                                hasTrailingDivider: true,
                                onClickFunction: function (event){
                                    let target = event.target || event.cyTarget;
                                    changeNodeSize(event, target.width() + 10);
                                }
                            },
                            {
                                id: 'decrease-size',
                                content: 'Decrease size',
                                tooltipText: 'Decrease size',
                                hasTrailingDivider: true,
                                onClickFunction: function (event){
                                    let target = event.target || event.cyTarget;
                                    changeNodeSize(event, target.width() - 10);
                                }
                            }
                        ]
                    },
                    {
                        id: '20',
                        content: 'Small',
                        tooltipText: 'Small',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            changeNodeSize(event, 20);
                        }
                    },
                    {
                        id: '35',
                        content: 'Medium (default)',
                        tooltipText: 'Medium (default)',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            changeNodeSize(event, 35);
                        }
                    },
                    {
                        id: '50',
                        content: 'Large',
                        tooltipText: 'Large',
                        hasTrailingDivider: true,
                        onClickFunction: function (event){
                            changeNodeSize(event, 50);
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
                    });
                    
                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'exportJSON',
                content: 'Export session',
                tooltipText: 'Export the session graph as a downloadable file',
                selector: "",
                onClickFunction: function (event) {
                    chrome.runtime.sendMessage({
                        message: "WILLOW_BACKGROUND_EXPORT",
                    });
                },
                show: true,
                coreAsWell: true
            },
            {
                id: 'importJSON',
                content: 'Import Session',
                tooltipText: 'Import a session from a ".willow" file',
                selector: "",
                onClickFunction: function (event) {
                    var input = document.createElement("INPUT");
                    input.setAttribute("type", "file");
                    input.addEventListener("change",  () => {
                        const reader = new FileReader();
                        reader.readAsText(input.files[0])
                        reader.onload = function () {
                            chrome.runtime.sendMessage({
                                message: "WILLOW_BACKGROUND_IMPORT",
                                json: JSON.parse(reader.result),
                            });
                        }
                    });
                    input.click();
                },
                show: true,
                coreAsWell: true
            },

        ],
        menuItemClasses: ['contex-menu-item'],
        contextMenuClasses: ['context-menu'],
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
            contextMenu.hideMenuItem('comment');
        }
        else if (evtTarget.isNode()){
            console.log("target is a node");
            contextMenu.showMenuItem('open');
            contextMenu.showMenuItem('open-in-new-tab');
            contextMenu.showMenuItem('comment');
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

/**
 * Sets the size of targeted node. 
 */
function changeNodeSize(event, size){
   
    if (size >= 10 && size <= 130) {
        let target = event.target || event.cyTarget;
        let id = target.id();
        target.data('width', size);
        chrome.runtime.sendMessage({
            message: "WILLOW_BACKGROUND_CHANGE_NODE_SIZE",
            nodeId: id,
            size: size
        });
        chrome.runtime.sendMessage({
            message: "WILLOW_GRAPH_SYNC_REQUEST",
        });
    }
}

/**
 * Sets the color of targeted node. 
 */
function changeNodeColor(event, color, colorName){
   
    let target = event.target || event.cyTarget;
    let id = target.id();
    target.style('border-color', color);
    chrome.runtime.sendMessage({
        message: "WILLOW_BACKGROUND_CHANGE_BORDER_COLOR",
        nodeId: id,
        color: colorName
    });
    chrome.runtime.sendMessage({
        message: "WILLOW_GRAPH_SYNC_REQUEST",
    });
}


/*
    Function that shows titles of node when users mouse hover over them
 */
function applyHoverOver(){
    cy.on('mouseover', 'node', function(e) {
        var sel = e.target;
        sel.addClass('hovered');
       
    });
    cy.on('mouseout', 'node', function(e) {
        var sel = e.target;
        sel.removeClass('hovered');
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
