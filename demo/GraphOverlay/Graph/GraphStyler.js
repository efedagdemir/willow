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
                if (ele.data('openTabCount') > 0 && ele.data("comment") == "" ) {
                    return [ele.data('iconURL'), chrome.extension.getURL('/GraphOverlay/Graph/circle2.png')];
                }
                if(ele.data('openTabCount') > 0 && ele.data("comment") != "" ){
                    return [ele.data('iconURL'), chrome.extension.getURL('/GraphOverlay/Graph/circle2.png'), chrome.extension.getURL('../../icons/pencil.png')];
                }     
                if(ele.data('openTabCount') <= 0 && ele.data("comment") != ""){
                    return[ele.data('iconURL'), chrome.extension.getURL('../../icons/pencil.png')];
                }                     
                else{
                    return ele.data('iconURL');
                }
                    
            },
            /*'background-image-containment': ['inside', 'over','over'],
            'background-width': ['100%', '23%','40%'],
            'background-height': ['100%', '23%','40%'],
            'background-position-x': ['0.5px', '-12.5px','62.5px'],
            'background-position-y':['0px', '3px','35px'],*/

            'background-image-containment': ['inside', 'over', 'over'],
            'background-width': ['100%', '40%','40%'],
            'background-height': ['100%', '40%','40%'],
            'background-position-x': ['0.5px', '-90%','160%'],
            'background-position-y':['0px', '0%','160%'],

            'background-image-opacity': ['1', '1','1'],
            'background-clip': ['node', 'none','none'],
            'bounds-expansion': ['50%','50%','50%','50%'],
            'font-family' : 'Century Gothic', //Open Sans
            'font-size': 'data(title_size)',
            'color': '#041424',
            'ghost': 'yes',
            'ghost-offset-x': '1px',
            'ghost-offset-y': '1px',
            'ghost-opacity': '0.5',

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
            'opacity': 1,
            'ghost': 'yes',
            'ghost-offset-x': '1px',
            'ghost-offset-y': '1px',
            'ghost-opacity': '0.5',
            'line-fill': 'linear-gradient',
            'line-gradient-stop-colors': ['#041424', '#8d0801'],
            'line-gradient-stop-positions': ['0%', '100%'],
            //'line-gradient-direction': 'to-right'
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
            'font-family' : 'Century Gothic',  
        })
        .update();   

        //cy.userZoomingEnabled(true);
        //cy.style().fromJson({'wheelSensitivity': '0.3'}).update();        
}