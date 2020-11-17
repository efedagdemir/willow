chrome.storage.local.get("visitedPages", function(result) {
    result.visitedPages.forEach(element => {
        document.write(element);
        document.write("<br>");
    });
});

chrome.storage.sync.get('url', function(data) {
    let url = data.url;
    chrome.history.getVisits( {url: url}, function(results) {
        let visit = results[0];
        document.write("visited: " + url + "\t(" + visit.transition + ")");
        document.write("ref: " + document.referrer);
    });
});
