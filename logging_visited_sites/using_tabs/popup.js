chrome.storage.local.get("sessionGraph", function(result) {
    result.sessionGraph.forEach(node => {
        treePrint(node,"");
    });
});

function treePrint(node, prefix) {
    document.write(prefix + node.url);
    document.write("<br>");
    node.children.forEach( child => {
        treePrint(child, prefix + ".....");
    });
}
