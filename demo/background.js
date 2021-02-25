let tabURLs = new Map();
console.log("helo");

let urlTitles = new Map();

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ sessionGraph: [] });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        console.log(tab.title);

        if(!changeInfo.url) {
            urlTitles.set(tab.url, tab.title); // bunlar önce firelarsa ok

            chrome.storage.local.get("sessionGraph", function (res) {
                let sessionGraph = res.sessionGraph;
                let node = search(sessionGraph, tab.url);
                if(node != null) {
                    node.title = tab.title;
                    chrome.storage.local.set({ sessionGraph: sessionGraph });
                    console.log("az daha sıçıyoduk");
                }
            });
        }

        if (changeInfo.url && changeInfo.url != "chrome://newtab/") {

            console.log(changeInfo.url);
            // a tab switched to a new URL

            chrome.storage.local.get("sessionGraph", function (res) {
                let sessionGraph = res.sessionGraph;
                console.log(sessionGraph);
                
                // if the url is already in the graph, how the page is visited does not matter.
                //  we don't create a new node and only change the tab.
                let newNode = search(sessionGraph, changeInfo.url);
                if (newNode) {
                    console.log("This url already is in the graph");
                    let oldNode = search(sessionGraph, tabURLs.get(tabId));
                    if(oldNode != null)
                        oldNode.openTabCount --;
                    
                    newNode.openTabCount ++;

                    chrome.storage.local.set({ sessionGraph: sessionGraph });
                    tabURLs.set(tabId, tab.url); 
                } else {
                    // determine how the page was visited.
                    chrome.history.getVisits({ url: tab.url }, function (visitItems) {
                        console.log("The page was visited ", visitItems.length, " times.");
                        console.log("Last transition type is ", visitItems[visitItems.length - 1].transition);
                        // if the new url is last visited by a link, the new page's node is a child of the node this tab is at.
                        if (visitItems[visitItems.length - 1].transition == "link" ||
                            visitItems[visitItems.length - 1].transition == "form_submit") {
                            let parentURL = tabURLs.get(tabId);
                            console.log("Adding ", tab.url, " with parent: ", parentURL);

                            // make a recursive search to find the parent.
                            let parentNode = search(sessionGraph, parentURL);

                            if(parentNode != null) {
                                console.log("found the parent!")
                                parentNode.children.push(new SessionNode(changeInfo.url, urlTitles.get(changeInfo.url), 1));
                                console.log(tab.title);
                                parentNode.openTabCount--;
                            } else {
                                // add the page as a root.
                                console.log("Adding ", tab.url, " as a root.");
                                sessionGraph.push(new SessionNode(changeInfo.url, urlTitles.get(changeInfo.url),1));
                            }
                        } else {
                            let oldNode = search(sessionGraph, tabURLs.get(tabId));
                            if(oldNode)
                                oldNode.openTabCount ++;
                            // add the page as a root.
                            console.log("Adding ", tab.url, " as a root.");
                            sessionGraph.push(new SessionNode(changeInfo.url, urlTitles.get(changeInfo.url),1));
                        }
                        chrome.storage.local.set({ sessionGraph: sessionGraph });
                        tabURLs.set(tabId, tab.url);
                    });
                }
            });

        }

    });
    function search(sessionGraph, url) {
        for (let i = 0; i < sessionGraph.length; i++) {
            let res = search_helper(url, sessionGraph[i]);
            if (res != undefined)
                return res;
        }
        return null;

        function search_helper(url, node) {
            if (node.url == url)
                return node;
            else {
                for (child in node.children) {
                    result = search_helper(url, node.children[child]);
                    if (result != null)
                        return result;
                }
            }
        }
    }

    chrome.tabs.onRemoved.addListener( function( tabId, removeInfo) {
        chrome.storage.local.get("sessionGraph", function (res) {
            let sessionGraph = res.sessionGraph;
            let node = search(sessionGraph, tabURLs.get(tabId));
            if(node){
                node.openTabCount --;
                chrome.storage.local.set({ sessionGraph: sessionGraph });
            }
        });
    });
        
});

class SessionNode {
    /**
     * @param {String} url 
     */
    constructor(url, title, openTabCount) {
        this.openTabCount = openTabCount;
        this.title = title;
        this.url = url;
        this.children = [];
    }
} 