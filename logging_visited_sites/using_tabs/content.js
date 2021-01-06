
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       
        if (request.overlaymsg == "displayOverlay"){
            sendResponse({farewell: "bye"});
            
            var iframe  = document.createElement ('iframe');
            iframe.src  = chrome.runtime.getURL ('overlay.html');
            iframe.style.position = 'fixed';
            iframe.style.bottom='1%'
            iframe.style.left='0%'
            iframe.style.height = "800px";
            iframe.style.width = "700px";
            document.body.zIndex = -1;
            iframe.style.zIndex = 0x7FFFFFFF;
            iframe.style.backgroundColor = "#A0A0A0";
            document.body.append(iframe)
            
        }
      
    }
    
  );