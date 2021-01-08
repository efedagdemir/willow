
let nodes = [];
let edges = [];
chrome.storage.local.get("sessionGraph", function(result) {
    result.sessionGraph.forEach(node => {
       treePrint(node,"");
         //initGraph(node);
    });
    initGraph(nodes,edges);
    
    
    /*result.sessionGraph.forEach(node =>{
        nodes.push({
            data: {
                id: node.url,
                //name: node.url
            }
        })
        treePrint(node,"");
        console.log("nodee ",node.url);
        node.children.forEach(child =>{
            console.log("child ",child.url);
            nodes.push({
                data: {
                    id: child.url,
                    //name: child.url
                }
            })
            edges.push({
                data:{
                    source: node.url,
                    target: child.url
                }
            })
        })
    })*/
    console.log(nodes);
    console.log(edges);
    initGraph(nodes,edges);
});

function treePrint(node, prefix) {
    console.log(node.title);
    
    nodes.push({
        data: {
            id: node.url,
            name: node.title ? node.title : node.url
        }
    })
    node.children.forEach( child => {
        edges.push({
            data:{
                source: node.url,
                target: child.url
            }
        })
        treePrint(child, prefix + ".....");    
    });
}

function initGraph(nodes,edges){   
    var cy = cytoscape({
        container: document.getElementById("cy"),
        elements: {
            nodes: nodes,
            edges: edges
        },
        layout: {
            name: 'dagre',

            // dagre algo options, uses default value on undefined
            nodeSep: undefined, // the separation between adjacent nodes in the same rank
            edgeSep: undefined, // the separation between adjacent edges in the same rank
            rankSep: undefined, // the separation between each rank in the layout
            rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
            ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
            minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
            edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

            // general layout options
            fit: true, // whether to fit to viewport
            padding: 30, // fit padding
            spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
            nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
            animate: false, // whether to transition the node positions
            animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
            animationDuration: 500, // duration of animation in ms if enabled
            animationEasing: undefined, // easing of animation if enabled
            boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
            ready: function(){}, // on layoutready
            stop: function(){} // on layoutstop

            /*fit: true, // whether to fit the viewport to the graph
            padding: 30, // the padding on fit
            startAngle: 3 / 2 * Math.PI, // where nodes start in radians
            sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
            clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
            equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
            minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
            boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
            nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
            height: undefined, // height of layout area (overrides container height)
            width: undefined, // width of layout area (overrides container width)
            spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
            concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
            return node.degree();
            },
            levelWidth: function( nodes ){ // the variation of concentric values in each level
            return nodes.maxDegree() / 4;
            },
            animate: false, // whether to transition the node positions
            animationDuration: 500, // duration of animation in ms if enabled
            animationEasing: undefined, // easing of animation if enabled
            animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
            ready: undefined, // callback on layoutready
            stop: undefined, // callback on layoutstop
            transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
            */
        },
          // so we can see the ids
        style: [
            {
              selector: 'node',
              style: {
                'label': 'data(name)',
                'background-color': '#50b46e'
              }
            },

            {
                selector: 'edge',
                style: {
                  'width': 3,
                  'line-color': 'grey',
                  'target-arrow-color': 'grey',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier'
                }
              }
          ]
      });
      console.log(cy);

      cy.nodes().on('click', function(e){
        var clickedNode = e.target;
        chrome.tabs.update({url: clickedNode.id()}, () =>{});
      });
}

/*

  
    <script src="popup.js"></script>*/ 