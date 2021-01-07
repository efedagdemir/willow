let tabURLs = new Map();
console.log("helo");

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ sessionGraph: [] });


    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            console.log(changeInfo.url);
            // a tab switched to a new URL

            chrome.storage.local.get("sessionGraph", function (res) {
                let sessionGraph = res.sessionGraph;
                console.log(sessionGraph);
                
                // if the url is already in the graph, how the page is visited does not matter.
                //  we don't create a new node and only change the tab.
                if (search(sessionGraph, changeInfo.url)) {
                    console.log("This url already is in the graph");

                } else {
                    // determine how the page was visited.
                    chrome.history.getVisits({ url: tab.url }, function (visitItems) {
                        console.log(visitItems.length);

                        // if the new url is last visited by typing, the new page's node is a root.
                        if (visitItems[visitItems.length - 1].transition == "typed") {
                            // add the page as a root.
                            console.log("Adding ", tab.url, " as a root.");
                            sessionGraph.push(new SessionNode(changeInfo.url));
                        }
                        // if the new url is last visited by a link, the new page's node is a child of the node this tab is at.
                        else if (visitItems[visitItems.length - 1].transition == "link") {
                            let parentURL = tabURLs.get(tabId);
                            console.log("Adding ", tab.url, " with parent: ", parentURL);

                            // make a recursive search to find the parent.
                            let parentNode = search(sessionGraph, parentURL);

                            parentNode.children.push(new SessionNode(changeInfo.url));
                        }
                        chrome.storage.local.set({ sessionGraph: sessionGraph });
                        tabURLs.set(tabId, tab.url);
                    });
                }
            });

            function search(sessionGraph, url) {
                for (let i = 0; i < sessionGraph.length; i++) {
                    let res = search_helper(url, sessionGraph[i]);
                    if (res)
                        return res;
                }
                return null;

                function search_helper(url, node) {
                    if (node.url == url)
                        return node;
                    else {
                        for (child in node.children) {
                            result = search(url, node.children[child]);
                            if (result)
                                return result;
                        }
                    }
                }
            }
        }

    });
});

class SessionNode {
    /**
     * @param {String} url 
     */
    constructor(url) {
        this.url = url;
        this.children = [];
    }
} 