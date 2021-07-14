/*
    This script does nothing. The only reason for this to exist is that applyStyle is required both in the background and in the content scripts.
    We avoid duplicating the code by putting this in a different javascript file that is both injected into tabs and the background.
 */
function renderNode( numOfBrokenLinks, ele) {
    // Icon path is assumed to be of 32x32 in this example. You may auto calculate this if you wish.
    const iconPath = 'M31.4,16.5c0.8,0.8,0.8,2,0,2.8l-6,6c-0.8,0.8-2,0.8-2.8,0l-2.9-2.9c0.6,3,0.2,6.2-1.3,9 c-0.2,0.3-0.5,0.5-0.9,0.5c-0.3,0-0.5-0.1-0.7-0.3l-7.6-7.5l-1.4,1.4C7.9,25.7,8,25.8,8,26c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-1.1,0.9-2,2-2c0.2,0,0.3,0.1,0.5,0.1l1.4-1.4l-7.5-7.5c-0.5-0.5-0.4-1.3,0.2-1.6c2.7-1.5,5.9-1.9,8.9-1.3L6.6,9.4 c-0.8-0.8-0.8-2,0-2.8l6-6C13,0.2,13.5,0,14,0c0.5,0,1,0.2,1.4,0.6L19.9,5l4.4-4.4c0.8-0.8,2-0.8,2.8,0c0,0,0,0,0,0l4.3,4.3 c0.8,0.8,0.8,2,0,2.8L27,12.1L31.4,16.5z M14,18c-2.5-2.5-6-3.5-9.4-2.8l12.2,12.2C17.5,24.1,16.5,20.5,14,18z M9.4,8l3.7,3.7 l4.6-4.6L14,3.4L9.4,8z M14.6,14.6c0.6,0.4,1.1,0.8,1.6,1.3c0.5,0.5,0.9,1,1.3,1.6L28.6,6.3l-2.9-2.9L14.6,14.6z M28.6,18l-3.7-3.7 l-4.6,4.6l3.7,3.7L28.6,18z';
    const iconColor = '#ffffff';

    const size = 100; // may need to calculate this yourself
    const iconResize = 22; // adjust this for more "padding" (bigger number = more smaller icon)

    const width = size;
    const height = size;
    const scale = (size - iconResize) / size;
    const iconTranslate = iconResize / 2 / scale;
    const backgroundColor = `#33362F`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
 <style>
    .small { font: italic 13px sans-serif; }
    .heavy { font: bold 30px sans-serif; }
    .Rrrrr { font: italic 40px serif; fill: red; }
  </style>
  <text x="0" y="15" fill="red" font-weight="bold" > ${numOfBrokenLinks}</text>    </svg>`;
    return {
        svg: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
        width,
        height,
    };
}

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
                let limit = 45
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
            'background-width': /*function (ele)
            {
                if(ele.data('brokenLinks') > 0)
                {
                    return ['100%', '80%','40%'];
                }
                else
                {
                    return ['100%', '23%','40%'];
                }
            },*/
             ['100%', '23%','40%'],
            'background-height': /*function (ele)
            {
                if( ele.data('brokenLinks') > 0)
                {
                    return ['100%', '80%','40%'];
                }
                else{
                    return ['100%', '23%','40%']
                }
            },
            */
                ['100%', '23%','40%'],
            'background-position-x': /*function (ele)
            {
                if( ele.data('brokenLinks') > 0)
                {
                    return ['0.5px', '-20px','62.5px'];
                }
                else{
                    return ['0.5px', '-12.5px','62.5px'];
                }
            },*/['0.5px', '-12.5px','62.5px'],
            'background-position-y': ['0px', '3px','35px'],
            'background-image': function (ele)
            {
                //alert(ele.data('brokenLinks'));
                if( ele.data('brokenLinks') > 0)
                {
                    return [ele.data('iconURL'), renderNode(ele.data('brokenLinks'), ele).svg];
                }
                else if( ele.data('brokenLinks') === 0)
                {
                    return ele.data('iconURL');
                }
                else if (ele.data('openTabCount') > 0 && ele.data("comment") === "" ) {
                    return [ele.data('iconURL'), chrome.extension.getURL('/GraphOverlay/Graph/active-color4.png')];
                }
                else if(ele.data('openTabCount') > 0 && ele.data("comment") !== "" ){
                    return [ele.data('iconURL'), chrome.extension.getURL('/GraphOverlay/Graph/active-color4.png'), chrome.extension.getURL('../../icons/notes.svg')];
                }     
                else if(ele.data('openTabCount') <= 0 && ele.data("comment") !== ""){
                    return[ele.data('iconURL'), chrome.extension.getURL('../../icons/notes.svg')];
                }                     
                else{
                    return ele.data('iconURL');
                }
                    
            },
            'background-image-containment': ['inside', 'over','over'],
            'background-image-opacity': ['1', '1','1'],
            'background-clip': ['node', 'none','none'],
            'bounds-expansion': ['35px','35px','35px','35px'],
            'font-family' : 'Open Sans',
            'font-size': 'data(title_size)'
        })
        .selector('edge')
        .style({
            'line-color': '#8d0801', /*#ab0321*/
            'target-arrow-color': '#8d0801',
            'line-style':  function (ele) {
                if(ele.data("discovering") === true){
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
        cy.nodes('[brokenLinks > 0]').style({
            'border-color':'red',
            'background-width': ['100%', '100%','40%'],
            'background-height': ['100%', '100%','40%'],
            'background-position-x': ['0.5px', '-20px','62.5px'],
        } );
}