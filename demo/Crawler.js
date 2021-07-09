

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const urlParser = require('url');
let mainURL;
const seenUrls = {};

const getUrl = (link, host, protocol) => {
    if (link.includes("https")) {
        return link;
    } else if (link.startsWith("/")) {
        return `${protocol}//${host}${link}`;
    } else {
        return `${protocol}//${host}/${link}`;
    }
};
async function crawlHelper(URL)
{
    const { host, protocol } = await urlParser.parse(URL);
    console.log("host", host);
    mainURL =  URL;
  await  crawl({
        url: URL,
        ignore: "/search",
        host: host,
        protocol: protocol,
    });
console.log( "all done!");

}
const crawl = async ({ url, ignore, host, protocol }) => {
    if (seenUrls[url]) return;
    console.log("crawling", url);
    seenUrls[url] = true;

    // console.log("host", host);
    //console.log("mainURL", mainURL);


    let urlWithoutPath = protocol + "//" + host;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("a")
        .map((i, link) => link.attribs.href)
        .get();

    // console.log("links",links);
    links
        .filter((link) => (link.startsWith(mainURL) || getUrl(link, host, protocol).startsWith(mainURL)) )
        .forEach((link) => {
            //  console.log( "taken", getUrl(link, host, protocol));
            crawl({
                url: getUrl(link, host, protocol),
                ignore: ignore,
                host: host,
                protocol: protocol,
            });
        });
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

