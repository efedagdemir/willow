
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
    console.log("icon url " + node.iconURL);
    
    nodes.push({
        data: {
            id: node.url,
            name: node.title ? node.title : node.url,
            iconURL: node.iconURL
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
        },
          // so we can see the ids 
          // function(node){ console.log( node.data("iconURL")); return `${node.data("iconURL")}`}
        style: [
            {
              selector: 'node',
              style: {
                'label': 'data(name)',
                'background-color': '#50b46e',
                'background-image': 'data(iconURL)',
                'background-image-opacity': 1,
                'background-opacity': 0,
                'background-fit': 'contain',
                'background-clip': 'node'
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