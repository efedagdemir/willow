/* Initializes the state of 'How To?' page */
chrome.storage.local.get(["WILLOW_HOW_TO_OPEN"], function (res) {
    if (res.WILLOW_HOW_TO_OPEN) {
        openSettingsMenu(false);
        openHowToPage(false);
    }
});
  
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
                <p class="details_p"> 
                    Willow provides a graph structure that tracks users' browsing sessions. Users can see the 
                    websites they visited/they're visiting as nodes of a graph. 
                </p>
            </details>
            <details class="willow_detail" id="det2">
                <summary class="willow_summary">Basic features</summary>
                <details class="nested_detail" id="det3">
                    <summary class="nested_summary">Dashed edges vs. Normal edges</summary>
                    <p class="nested_p"> Normal (continuous) edges represent the first time a page has been accessed. 
                    Dashed edges are used when a user opens a page any time except for the first time.</p>
                </details>
                <details class="nested_detail" id="det4">
                    <summary class="nested_summary">Active Nodes</summary>
                    <p class="nested_p"> Active nodes represent the currently open tabs. They are shown with the green
                    circle near them.</p>
                </details>
            </details>
            <details class="willow_detail" id="det5">
                <summary class="willow_summary">Running Layout</summary>
                <p class="details_p">Willow provides users with two layout options. The <b>Adjust</b> option re-applies an incremental
                 layout algorithm, which improves the layout while respecting the existing node locations. The <b>Recalculate</b> option 
                 creates an entirely new layout. The user can change the behavior of the layout button using the settings menu.
            </details>
            <details class="willow_detail" id="det6">
                <summary class="willow_summary">What is Page Rank?</summary>
                <p class="details_p"> By applying the <b> Page Rank</b> option, users can see the more topologically important nodes (according to
                how many nodes point to them and how important their pointees in turn are) bigger in the graph.
                This option overrides the previously arranged node sizes. The <b>Uniform</b> option resizes the nodes to their default values.  </p>
            </details>
            <details class="willow_detail" id="det7">
                <summary class="willow_summary">Export/Import Graph</summary>
                <p class="details_p"> Users can save their current graphs to their local file system with
                the <b>Export</b> option. Similarly they can re-open any exported session from their files with the 
                <b>Import</b> option. The active tabs on the saved graph are opened in the browser during the import process. </p>
            </details>
        </div>
    </div>
</body>
</html>
`;

function openHowToPage(isOrigin) {
    
    howToWrapper = document.createElement('div');
    howToWrapper.id = "willowHowToPageWrapper";
    howToWrapper.innerHTML = howToPageHTML;

    document.body.append(howToWrapper);
    document.getElementById("how_to_close_btn").onclick = () => closeHowToPage(true);
    addHowToPageDetailsListeners();
    arrangeDetailsTags();
    
    if (isOrigin) {
        // set global state
        chrome.storage.local.set({ WILLOW_HOW_TO_OPEN: true });
        // notify other tabs with a sync request
        chrome.runtime.sendMessage({ 
          message: "WILLOW_HOW_TO_SYNC_REQUEST",
          action: "WILLOW_HOW_TO_SYNC_OPEN",
        });
    }   
}

function closeHowToPage(isOrigin) {
    
    if (howToWrapper.parentNode != null){
        howToWrapper.parentNode.removeChild(howToWrapper);
        chrome.storage.local.set({ WILLOW_DETAILS_TAGS: "0000000" });
        if (isOrigin) {
            // set global state
            chrome.storage.local.set({ WILLOW_HOW_TO_OPEN: false });
            // notify other tabs with a sync request
            chrome.runtime.sendMessage({ 
            message: "WILLOW_HOW_TO_SYNC_REQUEST",
            action: "WILLOW_HOW_TO_SYNC_CLOSE",
            });
        }
    }
}

function addHowToPageDetailsListeners() {
    
    detail1 = document.getElementById("det1");
    detail1.addEventListener("toggle", event => { detailClicked(1, detail1.open)});
    detail2 = document.getElementById("det2");
    detail2.addEventListener("toggle", event => { detailClicked(2, detail2.open)});
    detail3 = document.getElementById("det3");
    detail3.addEventListener("toggle", event => { detailClicked(3, detail3.open)});
    detail4 = document.getElementById("det4");
    detail4.addEventListener("toggle", event => { detailClicked(4, detail4.open)});
    detail5 = document.getElementById("det5");
    detail5.addEventListener("toggle", event => { detailClicked(5, detail5.open)});
    detail6 = document.getElementById("det6");
    detail6.addEventListener("toggle", event => { detailClicked(6, detail6.open)});
    detail7 = document.getElementById("det7");
    detail7.addEventListener("toggle", event => { detailClicked(7, detail7.open)});
    
}

function arrangeDetailsTags(){
    chrome.storage.local.get(["WILLOW_DETAILS_TAGS"], function (res) {
        str = res.WILLOW_DETAILS_TAGS;
        for (let i = 0; i < str.length; i++) {
            if (str[i] == '1'){
                detNo = i + 1;
                document.getElementById("det" + detNo).open = true;}
        }
    });
}

/* Sends the message of which details tag 
   is opened and sets the details string */
function detailClicked(detail_no, open){
    
    
    chrome.storage.local.get(["WILLOW_DETAILS_TAGS"], function (res) {
        var newStr;
        str = res.WILLOW_DETAILS_TAGS;
        if (open)
            newStr = str.substr(0, detail_no-1) + "1" + str.substr(detail_no, str.length);
        else 
            newStr = str.substr(0, detail_no-1) + "0" + str.substr(detail_no, str.length);
        
        chrome.storage.local.set({ WILLOW_DETAILS_TAGS: newStr });
    });
   
    // notify other tabs with a sync request
    chrome.runtime.sendMessage({ 
        message: "WILLOW_HOW_TO_DETAILS_SYNC_REQUEST",
        detail_no: detail_no,
        open: open
    });
}

/*Listening synchronization requets*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "WILLOW_HOW_TO_SYNC_REQUEST") {
            handleHowToPageSyncRequest(request);
        }
        else if ( request.message == "WILLOW_HOW_TO_DETAILS_SYNC_REQUEST"){
            document.getElementById("det" + request.detail_no).open = request.open;
        } 
    }
);

function handleHowToPageSyncRequest(request) {
    if (request.action == "WILLOW_HOW_TO_SYNC_OPEN") {
        openHowToPage(false);
    } else if (request.action == "WILLOW_HOW_TO_SYNC_CLOSE") {
        closeHowToPage(false);    
    }
}

