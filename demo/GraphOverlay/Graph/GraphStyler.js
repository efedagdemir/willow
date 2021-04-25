/*
    This script does nothing. The only reason for this to exist is that applyStyle is required both in the background and in the content scripts.
    We avoid duplicating the code by putting this in a different javascript file that is both injected into tabs and the background.
 */

function applyStyle() {
    cy.style()/*.fromJson({'wheelSensitivity': '0.1'})*/
        .selector('node')
        .style({
            'width': 'data(width)',
            'height': 'data(width)',
            'border-width': 5, 
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
                if (ele.data('openTabCount') > 0 ) 
                    return [ele.data('iconURL'), chrome.extension.getURL('/GraphOverlay/Graph/active-color4.png')];
                else 
                    return ele.data('iconURL');
            },
            'background-image-containment': ['inside', 'over'],
            'background-width': ['100%', '20%'],
            'background-height': ['100%', '20%'],
            'background-position-x': ['0.5px', '-10.5px'],
            'background-position-y':['0px', '3px'],
            'background-image-opacity': ['1', '1'],
            'background-clip': ['node', 'none'],
            'bounds-expansion': ['0', '10'],
            'font-family' : 'Open Sans',
            'font-size': 'data(title_size)'
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
            'border-color': 'black',
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

        //cy.userZoomingEnabled(true);
        //cy.style().fromJson({'wheelSensitivity': '0.3'}).update();        
}