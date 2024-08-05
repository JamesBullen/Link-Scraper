import mysql2 from 'mysql2'
const require = createRequire(import.meta.url);
import { createRequire } from "module";
const temp = require('mysql2/promise')

function GenerateReport(pages, url) {
    const formatedURL = new URL(url).hostname.split('.')
    const tableName = `tbl_${formatedURL[0]}dot${formatedURL[1]}`
    // Even if order is not important, is needed to format list correctly for the loop
    const sortedPages = sortPages(pages);

    // Creates database & table if doesn't already exist
    connectToDatabase();
    createDatabase();
    connectToDatabase('linksdb');
    // Makes sure table is truncated before any new values are inserted, if table already existed
    createTable(tableName)

    //createTable(tableName).then(fillTable(sortedPages, tableName))

    // Inserts results into table of scraped website
    fillTable(sortedPages, tableName)

    console.log(`Table filled`);
};

function fillTable(pages,table) {
    for (const page of pages) {
        pool.query(`INSERT INTO ${table}(link,count) VALUES(${escape(page[0])}, ${page[1]})`, function(error) {if (error) throw error; console.log(`Record inserted`)})
    };
}

// Connects program to MySQL
let pool
function connectToDatabase(database) {
    pool = temp.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: database
    });
}

function createDatabase(){
    pool.query('CREATE DATABASE IF NOT EXISTS linksdb', function(error, result) {if (error) throw error; console.log(`Database created`)});
};

function createTable(table) {
    pool.query(`CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY, link TEXT, count INT)`,
    function(error, result) {if (error) throw error; console.log(`Table created`)});

    pool.query(`TRUNCATE TABLE ${table}`, function() {console.log(`truncate`)})
};

// Defunct and should only be used manually if can't to MySQL
// Generates a user friendly list of internal links and their count to console
function printReport(pages) {
    const sortedPages = sortPages(pages);

    console.log(`#==========#`);
    console.log(`Report Start`)
    console.log(`#==========#`);
    for (const sortedPage of sortedPages) {
        console.log(`${sortedPage[1]} counts of ${sortedPage[0]}`) 
    };
    console.log(`#=========#`);
    console.log(`Report End`);
    console.log(`#=========#`);
};

// Sorts given object by frequency in which internal links appear
function sortPages(pages) {
    // Turns object into array storing the dictionary as another array
    let pagesArray = []
    for (const page in pages) {
        pagesArray.push([page, pages[page]]);
    };

    // Sort numerically, highest to lowest
    pagesArray.sort(function(a,b){return b[1] - a[1]});

    return pagesArray;
};

export {GenerateReport, printReport, sortPages};