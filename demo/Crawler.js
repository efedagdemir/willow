chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (   request.message === "WILLOW_CRAWL")
        {
            alert(request.URL);
            crawlURL(request.URL);
        }
    }
);


function crawlURL(URL)
{
    const Crawler = require('node-html-crawler');
    
}