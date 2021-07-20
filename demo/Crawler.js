

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const urlParser = require('url');
var mainURL;
const seenUrls = {};
let crawlerURLs = {};

const getUrl = (link, host, protocol) => {
    console.log(link);
    if (link.includes("http")) {
        return link;
    } else if (link.startsWith("/")) {
        return `${protocol}//${host}${link}`;
    } else {
        return `${mainURL}/${link}`;
    }
};
async function crawlHelper(URL)
{
    if(!URL.startsWith("http") && URL.startsWith("www.") )
    {
        URL = "https://" + URL;
    }
    else if( !URL.startsWith("http") && !URL.startsWith("www.") )
    {
        URL = "https://www." + URL;
    }
    mainURL =  URL;
    await chrome.runtime.sendMessage({
        message: "WILLOW_SPINNER_SYNC_REQUEST",
        action: "WILLOW_SPINNER_OPEN",
        URL: mainURL
    });
    const { host, protocol } = await urlParser.parse(URL);
    //console.log("host", host);
    //console.log("protocol", protocol);
    await  crawl({
        url: URL,
        ignore: "/search",
        host: host,
        protocol: protocol,
      parent: null
    });
    console.log( "all done!");
    await chrome.runtime.sendMessage({
        message: "WILLOW_SPINNER_SYNC_REQUEST",
        action: "WILLOW_SPINNER_CLOSE",
        URL: URL
    });
}
async function buildGraph( parentURL,childURL, title )
{
    let addedNode = await cy.getElementById(childURL);
    let newNode = true;
    if( addedNode.length > 0)
    {
        newNode = false;
    }
    else
    {
        let favIconUrl = "chrome://favicon/size/64@1x/" + childURL;
        let node = cy.add({// add the node to the cy graph
            group: 'nodes',
            data: {id: childURL, title_size: '20px', title: title, width: 35, border_color: "#808080", openTabCount:1, iconURL: favIconUrl, comment: "", brokenLinks: 0},
        });
    }

    //Set parent broken link
    addedNode.data( 'brokenLinks', 0);
    cy.data("png", cy.png({full:true}));



    if( parentURL !== null) {
        // alert( sourceURL);
        if (cy.edges('edge[source = "' + parentURL + '"][target = "' + childURL + '"]').length > 0) {
            // the edge is already in the graph
            /** NOP */
        } else {
            if (cy.getElementById(parentURL).length > 0) { // if the sourceURL has a node in the graph.
                // add the new node as a child.
                let newEdge = cy.add({group: 'edges', data: {source: parentURL, target: childURL}});
                if (newNode)
                    newEdge.data("discovering", true);
            } else {
                //console.warn( "The parent of the newly loaded page is not in the session graph.");
            }
        }
    }

    runLayout();
    var instance = cy.layoutUtilities(
        {    idealEdgeLength: 50,        //10
            offset: 20,                 //10

            desiredAspectRatio: 1,
            polyominoGridSizeFactor: 1,
            utilityFunction: 1,
            componentSpacing: 30        //10
        });

    instance.placeNewNodes(cy.getElementById(childURL));
    runLayout();
    //trial
    var components = cy.elements().components();
    var subgraphs = [];
    components.forEach(function (component) {
        var subgraph = {};
        subgraph.nodes = [];
        subgraph.edges = [];

        component.edges().forEach(function (edge) {
            var boundingBox = edge.boundingBox();
            subgraph.edges.push({ startX: boundingBox.x1, startY: boundingBox.y1, endX: boundingBox.x2, endY: boundingBox.y2 });
        });
        component.nodes().forEach(function (node) {
            var boundingBox = node.boundingBox();
            subgraph.nodes.push({ x: boundingBox.x1, y: boundingBox.y1, width: boundingBox.w, height: boundingBox.h });
        });

        subgraphs.push(subgraph);
    });

    var result = instance.packComponents(subgraphs);
    components.forEach(function (component, index) {
        component.nodes().layout({
            name: 'preset',
            animate: false,
            fit: false,
            transform: (node) => {
                let position = {};
                position.x = node.position('x') + result.shifts[index].dx;
                position.y = node.position('y') + result.shifts[index].dy;
                return position;
            }
        }).run();
    });
    broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST_WINDOW_PANEL", notifyActiveTab: true});
    return null;
}
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
const crawl = async ({ url, ignore, host, protocol, parent }) => {
    console.log("in crawler");
    let node = await cy.getElementById(url);
    if (seenUrls[url])
    {
        console.log("seen");
        return;
    }
    console.log("crawling", url);
    seenUrls[url] = true;
    let errorHasOccured = false;
    node.data( 'brokenLinks', 0);

    // console.log("host", host);
    //console.log("mainURL", mainURL);
    let responseURL;
  await  fetch(url).then(handleErrors)
        .then(function(response) {
            responseURL = response;
          // console.log("ok");
        }).catch(function(error) {
           crawlerURLs[parent]++;
           console.log("incremented for " + parent);
           errorHasOccured = true;
        });

  if(  errorHasOccured)
  {
      console.log("error has occured");
      if(parent !== null)
      {
          let parentNode = cy.getElementById(parent);
          let broken =  parseInt(parentNode.data('brokenLinks')) + 1;
          await parentNode.data( 'brokenLinks',  broken);
          broadcastSyncRequest({message: "WILLOW_GRAPH_SYNC_REQUEST_WINDOW_PANEL", notifyActiveTab: true});
      }
      else
      {
          alert("Error: URL to crawl is invalid. Please enter a valid URL");
      }
      errorHasOccured = false;
      return;
  }
    const html = await responseURL.text();
    const $ = await cheerio.load(html);
    const links = $("a")
        .map((i, link) => link.attribs.href)
        .get();

    const title = await $("title").text();
    console.log("title", title);
    await buildGraph(parent, url, title);


    // console.log("links",links);
    const  result = links.filter( (link) => ( (parent === null && getUrl(link, host, protocol).startsWith(mainURL)) || getUrl(link, host, protocol).startsWith(parent) ));
    console.log("result", result);
    console.log("parent", parent);

    for ( const link of result)
    {
        console.log(link);
       await crawl({
            url: getUrl(link, host, protocol),
            ignore: ignore,
            host: host,
            protocol: protocol,
            parent : url
        });
    }


/*
    links
        .filter(  (link) => (link.startsWith(mainURL) || getUrl(link, host, protocol).startsWith(mainURL) || !link.startsWith("http")) )
        .forEach( (link) => {
           // console.log("link",link);
               crawl({
                url: getUrl(link, host, protocol),
                ignore: ignore,
                host: host,
                protocol: protocol,
                parent : url
            });
        });

 */
    // console.log("blank space", "    ");
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (   request.message === "WILLOW_CRAWL")
        {
            crawlHelper(request.URL);
        }
    }
);

