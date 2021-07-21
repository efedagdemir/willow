
let searchWrapper;
function searchOpen()
{
   // alert("open");
    searchWrapper = document.createElement('div');
    searchWrapper.id = "willowSearchWrapper";
    searchWrapper.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/search.css")}">
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
    <div id="search">
        <div class="search-close-button"> <button type="button" id="search_close_btn"></button>
        </div>
        <div id="menuHeader">
            <p>Search</p>
        </div>
        <div id="menuBody">
           
                <div class="topnav">
                    <input type="text" placeholder="Search" id="search_URL" >
                </div>
          
            <br><br><br>
            <table id="settings_button_table1" class="willow_tables">
                <tr class="space_table_cell">
                    <td> <button id="search_URL_btn" class="table-buttons1" title="Search">Search</button></th>
                </tr> 
            </table>
        </div>
    </div>
    
    </body>
     <script src="node_modules/jquery/src/jquery.js"></script>
    </html>
    `;
    document.body.append(searchWrapper);
    //alert(spinnerOpen);
    addSearchListeners();
    chrome.storage.local.set({ WILLOW_SEARCH_OPEN_REQUEST: true });
}

function closeSearch(isCross) {

    if (document.body.contains(searchWrapper)) {
        document.body.removeChild(searchWrapper);
        if (isCross){
            // set global state
            chrome.storage.local.set({ WILLOW_SEARCH_OPEN_REQUEST: false });
            // broadcast
            /*
            chrome.runtime.sendMessage({
                message: "WILLOW_SEARCH_SYNC_REQUEST",
                action: "WILLOW_SEARCH_CLOSE"

            });
             */
        }
    }
}
function addSearchListeners() {
    document.getElementById("search_close_btn").onclick   = () => closeSearch(true);
    document.getElementById("search_URL_btn").onclick   = () => searchGiven();
}

function searchGiven()
{
    var URLToSearch = document.getElementById("search_URL").value;

  //  alert(URLToSearch);
    chrome.runtime.sendMessage({
        message: "WILLOW_SEARCH_URL",
        URL_TO_SEARCH: URLToSearch
    });
    closeSearch(true);
}

chrome.storage.local.get(["WILLOW_SEARCH_OPEN_REQUEST"], function (res) {
    if (res.WILLOW_SEARCH_OPEN_REQUEST ) {
        //console.log("bir")
        searchOpen();
    }

});


async function handleSearchSyncRequest(request)
{
    URLcrawling = request.URL ;
    //alert(request.URL);
    if( request.action === "WILLOW_SEARCH_OPEN")
    {
        //  alert("heard from open");
        await searchOpen();
    }
    else if(request.action === "WILLOW_SEARCH_CLOSE" )
    {
        await closeSearch();
    }
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "WILLOW_SEARCH_SYNC_REQUEST") {
            //alert("heard");
            handleSearchSyncRequest(request);
        }
    }
);
