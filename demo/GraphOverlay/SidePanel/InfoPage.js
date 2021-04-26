/* Initializes the state of 'Info' page */
chrome.storage.local.get(["WILLOW_INFO_OPEN"], function (res) {
    
    if (res.WILLOW_INFO_OPEN) {
        openSettingsMenu(false);
        openInfoPage(false);
    }
  });


var infoPageHTML = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="${chrome.runtime.getURL("GraphOverlay/SidePanel/info_page.css")}">
    <style>
    
        /* width */
        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.0);
            border-radius: 20px;
            
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
            border-radius: 40px;
        }
    </style>
</head>

<body>
    <div id="infoPage"> 
        
        <div id="willowInfoHeader">
            
            <button type="button" id="info_close_btn"></button>
            <p id="firstP"> 
                <b>Willow: Graph-Based Browsing </b>
            </p>

        </div>
        <div id="willowInfoBody">
            
            <p id="secondP">  
                Bilkent CS Senior Design Project <br> <br>
                <b> Contact: </b> <br>
                bilkent-cs-senior-willow@googlegroups.com <br> <br>
                <b> Supervisor: </b> Ugur Dogrusoz  <br>
                <b> Github: </b> <a href="https://github.com/efedagdemir/willow">Willow!</a> <br>      
            </p>
        
            <footer id="willow_footer">
                Version 1.0 - 2021 <br>
                Icons made by "Smashicons"   	from flaticon.com <br>
                Icons made by "Freepik" 	  	from flaticon.com <br>
                Icons made by "Pixel perfect" 	from flaticon.com 
            </footer>

        </div>    
    </div>
</body>
</html>
`;
   

function openInfoPage(isOrigin) {
   
    infoWrapper = document.createElement('div');
    infoWrapper.id = "willowInfoPageWrapper";
    infoWrapper.innerHTML = infoPageHTML;
    
    document.body.append(infoWrapper);
    document.getElementById("info_close_btn").onclick = () => closeInfoPage(true); 

    if (isOrigin) {
        // set global state
        chrome.storage.local.set({ WILLOW_INFO_OPEN: true });
        // notify other tabs with a sync request
        chrome.runtime.sendMessage({ 
          message: "WILLOW_INFO_SYNC_REQUEST",
          action: "WILLOW_INFO_SYNC_OPEN",
        });
    }
}


function closeInfoPage(isOrigin) {
    
    if (infoWrapper.parentNode != null){
        infoWrapper.parentNode.removeChild(infoWrapper);
        if (isOrigin) {
            // set global state
            chrome.storage.local.set({ WILLOW_INFO_OPEN: false });
            // notify other tabs with a sync request
            chrome.runtime.sendMessage({ 
            message: "WILLOW_INFO_SYNC_REQUEST",
            action: "WILLOW_INFO_SYNC_CLOSE",
            });
        }
    }
}

/*Listening synchronization requets*/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message != "WILLOW_INFO_SYNC_REQUEST") {
          return;
      }
      handleInfoPageSyncRequest(request);
    }
);

function handleInfoPageSyncRequest(request) {
    if (request.action == "WILLOW_INFO_SYNC_OPEN") {
        openInfoPage(false);
    } else if (request.action == "WILLOW_INFO_SYNC_CLOSE") {
        closeInfoPage(false);    
    }
}