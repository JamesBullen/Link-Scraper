// Dependency needed for emulating webpages
import {JSDOM} from 'jsdom'

// Formats URL input into a consistent format for later comparisons
function normaliseURL(url) {
    let urlObject = new URL(url)
    let newURL = `${urlObject.host}${urlObject.pathname}`

    if (newURL.slice(-1) === '/') {
        newURL = newURL.slice(0, -1)
    };

    return newURL;
};

// Collects all anchor elements and returns their href value as an array
function scrapeURLs(html, url) {
    // Emulates the given HTML, collects all anchor elements into an array
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')

    // Checks each anchor for a href value, adds to array if forms a valid URL
    let urlList = []
    for (const anchor of anchors) {
        if (anchor.href != "") {
            let href = anchor.href

            //console.log(`Scraping ${anchor}`)

            try {
                href = new URL(href, url)
                urlList.push(href.href)
            } catch (error) {
                console.log(`${error.message} >> ${href}`)
            }
        }
    };

    return urlList
};

// Recursively crawls the domain for internal links and returns a count list
async function scrapePage(baseURL, newURL = baseURL, pages = {}) {
    // Checks if given URL is an internal Link, returns if external
    const baseURLOjbect = new URL(baseURL);
    const newURLOjbect = new URL(newURL);
    if (newURLOjbect.host !== baseURLOjbect.host) {
        return pages
    };

    // Checks if given URL has been noted yet, increments if so
    const normalisedURL = normaliseURL(newURL);
    if (pages[normalisedURL]) {
        pages[normalisedURL] = pages[normalisedURL] +1;
        return pages;
    } else {
        pages[normalisedURL] = 1;
    };

    // Gets HTML of given URL, returns if there is none or errors
    let html
    try {
        html = await fetchHTML(newURL)
    } catch (error) {
        console.log(`error: ${error.message}`)
        return pages
    }

    // Gets all anchors of given URL and recursively checks them all for more interal links
    const urls = scrapeURLs(html, baseURL)
    try {
        await Promise.all(urls.map((url) => scrapePage(baseURL, url, pages)))
    } catch (error) {
        console.log(`${Object.keys(pages).length}: ${error.message}`)
    }


    // const urls = scrapeURLs(html, baseURL)
    // for (const url of urls) {
    //     pages = await scrapePage(baseURL, url, pages);
    // };

    return pages;
};

// Calls and retrieves HTML from a given URL, returns as text
async function fetchHTML(url) {
    // Makes HTTP request to the given URL
    let response;
    try {
        response = await fetch(url)
    } catch (error) {
        throw new Error(`${error.message}`);
    };

    // Stops the function if failed to network correctly
    if (response.status >= 400) {
        throw new Error(`${response.status}: ${response.statusText}`);
    };

    // Checks if given URL has any HTML to be returned
    const content = response.headers.get('Content-Type')
    if (!content || !content.includes('text/html')) {
        throw new Error(`No HTML to scrape: ${content}`);
    };

    return response.text()
}

export {normaliseURL, scrapeURLs, scrapePage};