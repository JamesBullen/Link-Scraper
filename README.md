# Internal Link Scraper
A web scraper that crawls through an emulated website of a given URL. Once finished it'll store the individual links and frequency of appearance to a MySQL database.

## About
The program will fetch the HTML from the given URL, and then emulate a copy of the website using JSDOM. Now that we have our virtual copy, `.querySelectorAll()` can be used to get all the anchor tags. External links are filtered by comparing the domain from the href, with the domain from the original given URL. Those that are internal links, are counted and then recursively emulated, and scraped for any anchors they have.

The recursive function will return an object of the full ink URL and count of occurence. The program is set up at the moment to automatically try to connect to a local MySQL server, create a database if one doesn't exist already, and store the results in a table.

## Installation
### Dependencies
- JSDOM
- MySQL2

### Dev Dependencies
- Jest
- dotenv

### Installation
Simply place the folder on the device you wish to run it on.

### Executing program
- npm run start <website URL> (for WSL)
- node main.js <website URL> (for Windows)

## Authors
- James Bullen

## Acknowledgements
- Lane Wagner from Boot.Dev for the project
