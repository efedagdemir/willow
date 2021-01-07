chrome.storage.local.get("sessionGraph", function(result) {
    result.sessionGraph.forEach(node => {
        treePrint(node,"");
    });
});

function treePrint(node, prefix) {
    if(node.openTabCount > 0)
        document.getElementById("textArea").innerHTML = document.getElementById("textArea").innerHTML + "OPEN";
    document.getElementById("textArea").innerHTML = document.getElementById("textArea").innerHTML + prefix + node.url + "<br>";
    
    node.children.forEach( child => {
        treePrint(child, prefix + ".....");
    });
}
