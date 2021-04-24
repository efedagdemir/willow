

var howToPageHTML = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/how_to_page.css")}">
    <style>
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.0);
            border-radius: 20px;
        }
       
        ::-webkit-scrollbar-thumb {
            background: #888; 
            border-radius: 40px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
    </style>
</head>

<body>
    <div id="howToPage">
        <div id="willowHowToHeader">       
            <button type="button" id="how_to_close_btn"></button>
            <p id="willow_header_how_to"> 
                <b>How to use Willow?</b>
            </p>
        </div>
        <div id="willowHowToBody">
            <details class="willow_detail" id="det1">
                <summary class="willow_summary">What is the purpose of Willow?</summary>
                <p id="willow_purpose"> 
                    Willow provides a graph structure that tracks users' browsing sessions. Users can see the 
                    websites they visited/they're visiting as nodes of a graph. 
                </p>
            </details>
            <details class="willow_detail" id="det2">
                <summary class="willow_summary">Basic features</summary>
                <details class="nested_detail">
                    <summary class="nested_summary">Dashed edges vs. Normal edges</summary>
                    <p> Normal (continuous) edges represent the first time a page has been accessed. 
                    Dashed edges are used when a user opens a page any time except for the first time.</p>
                </details>
                <details class="nested_detail">
                    <summary class="nested_summary">Active Nodes</summary>
                    <p> Active nodes represent the currently open tabs. They are shown with the yellow
                    cirlce image put on top of them.</p>
                </details>
            </details>
            <details class="willow_detail" id="det3">
                <summary class="willow_summary">What is Page Rank?</summary>
                <p id="willow_page_rank"> By applying the <b> Page Rank</b> option, users can see the more frequently visited websites bigger in the graph.
                This option overrides the previously arranged node sizes. The <b>Uniform</b> option resizes the nodes to their default values.  </p>
            </details>
        </div>
    </div>
</body>
</html>
`;

function openHowToPage() {
    
    howToWrapper = document.createElement('div');
    howToWrapper.id = "willowHowToPageWrapper";
    howToWrapper.innerHTML = howToPageHTML;

    document.getElementById("panelBody").appendChild(howToWrapper);
    document.getElementById("how_to_close_btn").onclick = () => closeHowToPage(); 
   
   
}


function closeHowToPage() {
    howToWrapper.parentNode.removeChild(howToWrapper);
   
}
