chrome.storage.local.get("visitedPages", function(result) {
    result.visitedPages.forEach(element => {
        document.write(element);
        document.write("<br>");
    });
});