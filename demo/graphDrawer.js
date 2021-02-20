let canvas = document.getElementById("panelBody"); // This assumes some content script injects a div with id "panelBody" before this script runs.

let cy = cytoscape();

chrome.runtime.sendMessage( {type : "getCytoscapeJSON"}, function (response) {
    console.log(response);
    cy.mount(canvas);
    cy.json(response);
});

cy.on('dragfree', 'node', function(evt){
    console.log( 'DF: ', evt.target.position());
    chrome.runtime.sendMessage( {type: "updateNodePosition"})
});