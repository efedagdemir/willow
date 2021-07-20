
var spinnerOpen = false;
var spinnerWrapper;
var URLcrawling;
function openSpinner()
{
   // alert("open");
    spinnerWrapper = document.createElement('div');
    spinnerWrapper.id = "willowSpinnerWrapper";
    spinnerWrapper.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/spinner.css")}">
                  <script src="node_modules/cytoscape-dagre/cytoscape-dagre.js"></script>

        <style>
        /* width */
        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.0);
            border-radius: 10px;
            
        }
       
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #888; 
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 20px;
        }
        </style>

    </head>

    <body>
    <div id="spinner"> 
        <div id="menuHeader">
            <p>Crawling...</p>
        </div>
        <div id="menuBody">
            <div class="lds-dual-ring"></div> 
                 <br><br><br>
        </div>  
    </div>
    
    </body>
     <script src="node_modules/jquery/src/jquery.js"></script>
    </html>
    `;
    document.body.append(spinnerWrapper);
    spinnerOpen = true;
    //alert(spinnerOpen);
    chrome.storage.local.set({ WILLOW_SPINNER_OPEN: true });
}

function closeSpinner() {

    if (document.body.contains(spinnerWrapper)) {
        document.body.removeChild(spinnerWrapper);

    }
    chrome.storage.local.set({ WILLOW_SPINNER_OPEN: false });

    spinnerOpen = false;
    /*
    chrome.runtime.sendMessage({
        message: "WILLOW_SPINNER_SYNC_REQUEST",
        action: "WILLOW_SPINNER_CLOSE"
    });
     */
}
chrome.storage.local.get(["WILLOW_CRAWLER_OPEN"], function (res) {
    if (res.WILLOW_SPINNER_OPEN ) {
        //console.log("bir")
        openSpinner();
    }

});
async function handleSpinnerRequest(request)
{
    URLcrawling = request.URL ;
    //alert(request.URL);
    if( request.action === "WILLOW_SPINNER_OPEN")
    {
      //  alert("heard from open");
        await openSpinner();
    }
    else if(request.action === "WILLOW_SPINNER_CLOSE" )
    {
       await closeSpinner();
    }

}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "WILLOW_SPINNER_SYNC_REQUEST") {
            handleSpinnerRequest(request);
        }
    }
);
