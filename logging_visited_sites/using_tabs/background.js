let tabs = new Map();

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ visitedPages: [] });
    
    //Added an option of seeing the overlay to right click
    chrome.contextMenus.create(
    {id: "overlayW", title: "See Overlay"});

        /*
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.url != undefined) {
            // a tab switched to a new URL

            // if the url is already in the graph, how the page was visited does not matter.
            //  we don't create a new node and only change the tab.
            // make a recursive search to find node.
            let exists = false;
            chrome.storage.local.get("visitedPages", function (res) {
                for (root in res.visitedPages) {
                    if (search(changeInfo.url, res.visitedPages[root])) {
                        exists = true;
                        break;
                    }
                }

                function search(url, node) {
                    if (node.url == url)
                        return true;
                    else {
                        let found = false;
                        for (child in node.children)
                            if(search(url, node.children[child]))
                                found = true;
                        return found;
                    }
                }

                if (exists) {
                    console.log("This url already is in the graph");
                    tabs.set(tabId, tab.url);
                } else {
                    // determine how the page was visited.
                    chrome.history.getVisits({ url: tab.url }, function (visitItems) {
                        // if the new url is last visited by typing, the new page's node is a root.
                        if (visitItems[0].transition == "typed") {
                            // add the page as a root.
                            console.log("Adding ", tab.url, " as a root.");
    
                            chrome.storage.local.get("visitedPages", function (res) {
                                console.log(res.visitedPages);
    
                                res.visitedPages.push(new SessionNode(changeInfo.url));
                                chrome.storage.local.set({ visitedPages: res.visitedPages });
                            });
    
                        }
    
                        // if the new url is last visited by a link, the new page's node is a child of the node this tab is at.
                        if (visitItems[0].transition == "link") {
                            let parent = tabs.get(tabId);
                            console.log("Adding ", tab.url, " with parent: ", parent);
    
                            chrome.storage.local.get("visitedPages", function (res) {
                                console.log(res.visitedPages);
    
                                // make a recursive search to find the parent.
                                let parentNode = null;
                                for (root in res.visitedPages) {
                                    console.log(res.visitedPages[root]);
                                    if (search(parent, res.visitedPages[root])) {
                                        parentNode = search(parent, res.visitedPages[root]);
                                        break;
                                    }
                                }
    
                                function search(parent, node) {
                                    if (node.url == parent)
                                        return node;
                                    else {
                                        for (child in node.children) {
                                            result = search(parent, node.children[child]);
                                            if(result)
                                                return result;
                                        }
                                    }
                                }
    
                                parentNode.children.push(new SessionNode(changeInfo.url));
    
                                chrome.storage.local.set({ visitedPages: res.visitedPages });
                            });
                        }
                        tabs.set(tabId, tab.url);
                    });
                }

            });
            // chrome.storage.local.get("visitedPages", function(res) {
            //     console.log("yelo");
            //     console.log(res.visitedPages);
            //     res.visitedPages.push(changeInfo.url);
            //     chrome.storage.local.set({visitedPages: res.visitedPages});
            // });
        }

    });*/
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    //info {editable,frameId, menuItemId, pageUrl}
    // tab {active,audible,autoDiscardable,discarded,favIconUrl,height,highlighted,id,
    //      incognito,index,mutedInfo,pinned,selected,status,title,url,width,windowId}
    if (info.menuItemId == "overlayW") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {overlaymsg: "displayOverlay", node: chrome.storage.local.get("visitedPages", function(){ alert("callback") })}, function(response) {
              alert(response.farewell);
            });
          });
    }
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