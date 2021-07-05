// initialize the menu's open/closee state
chrome.storage.local.get(["WILLOW_CRAWLER_OPEN"], function (res) {
    if (res.WILLOW_CRAWLER_OPEN ) {
        //console.log("bir")
        openCrawlMenu(false);
    }
});
var menuIsOpen = false;
var menuWrapper;
function openCrawlMenu(isOrigin) {
    menuWrapper = document.createElement('div');
    menuWrapper.id = "willowSettingsMenuWrapper";
    var settingsMenuHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/devMood.css")}">
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
    <div id="devMenu">
        <div class="crawler-close-button"> <button type="button" id="crawler_close_btn"></button>
        </div><div id="menuHeader">
           
            <p>Crawler</p>
        </div>
        <div id="menuBody">
           
                <div class="topnav">
                    <input type="text" placeholder="Search..">
                </div>
          
            <br><br><br>
            <table id="settings_button_table1" class="willow_tables">
                <tr class="space_table_cell">
                    <td> <button id="crawl" class="table-buttons1" title="Crawl the URL">Crawl the URL</button></th>
                </tr> 
            </table>
        </div>
    </div>
    </body>
    </html>
    `;
    menuWrapper.innerHTML = settingsMenuHTML;
    document.body.append(menuWrapper);
    addCrawlMenuListeners();
    menuIsOpen = true;
}

function closeCrawlMenu(isCross) {

    if (document.body.contains(menuWrapper)) {
        document.body.removeChild(menuWrapper);
        if (isCross){
            // set global state
            chrome.storage.local.set({ WILLOW_CRAWLER_OPEN: false });
            // broadcast
            chrome.runtime.sendMessage({
                message: "WILLOW_CRAWLER_SYNC_REQUEST",
                action: "WILLOW_CRAWLER_CLOSE"
            });
        }
    }
    menuIsOpen = false;
}

function crawlGivenURL()
{

}

function addCrawlMenuListeners() {
    document.getElementById("crawler_close_btn").onclick   = () => closeCrawlMenu(true);
    document.getElementById("crawl").onclick   = () => crawlGivenURL();
}


/**
 * SYNCING SETTINGS MENU OPEN/CLOSED SETTINGS
 */

// listen for settings menu sync requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "WILLOW_CRAWLER_SYNC_REQUEST") {
            handleCrawlerSyncRequest(request);
        }
    }
);

function handleCrawlerSyncRequest(request) {

    if (request.action === "WILLOW_CRAWLER_OPEN") {
        //console.log("sync_open recv.");
        openCrawlMenu(false);
    } else if (request.action === "WILLOW_CRAWLER_CLOSE") {
        //console.log("sync_closed recv.");
        closeCrawlMenu(false);
    }
}