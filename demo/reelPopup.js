let textField = document.getElementById("text");
textField.innerHTML = "";

////console.log(chrome.extension.getBackgroundPage().getSessionGraph().entries());

chrome.extension.getBackgroundPage().getSessionGraph().forEach( (value) => {
    ////console.log("hey");
    treePrint(value, "");
});

function treePrint(node, prefix) {
    textField.innerHTML += "<br>" + node.openTabCount + prefix + node.title;

    node.children.forEach( child => {
        treePrint(child, prefix + ".....");    
    });
}