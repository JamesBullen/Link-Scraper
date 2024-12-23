// Package runs on modules, but mysql2 module doesn't contain promise support
// 'require' is needed to fetch the promise compatible version
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sql = require('mysql2/promise');

require('dotenv').config();
const sqlPassword = process.env.sqlPassword;

function GenerateReport(pages, url) {
    // Formats hostname so it can be used to name and refernce our table
    const formatedURL = new URL(url).hostname.split('.');
    const tableName = `tbl_${formatedURL[0]}dot${formatedURL[1]}`;
    // Even if order is not important, is needed to format list correctly for the loop
    const sortedPages = sortPages(pages);

    // First connect is to create the database if needed
    connectToDatabase();
    createDatabase();
    // Second connect to use database. query(USE ...) to select a database doesn't work
    connectToDatabase('linksdb');
    createTable(tableName, sortedPages, tableName);
};

// Connects program to MySQL
let pool;
function connectToDatabase(database) {
    pool = sql.createPool({
        host: 'localhost',
        user: 'root',
        password: sqlPassword,
        database: database
    });
};

// Creates database if our hard coded default doesn't exist already
function createDatabase(){
    try {
        pool.query('CREATE DATABASE IF NOT EXISTS linksdb');
        console.log(`Database created`);
    } catch (error) {
        throw new Error(error.message);
    };
};

async function createTable(table, pages) {
    // Creates our website table if it doesn't exist already, then clears its content in the case it already existed with entries
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY, link TEXT, count INT)`);
        await pool.query(`TRUNCATE TABLE ${table}`);
        console.log(`Table created`);
    } catch (error) {
        throw new Error(error.message);
    };

    // Concurrently fills the table with scraped results. Wont be added in sorted order, use ORDER BY query for that
    // Must be in this function. If seporate funcation, it will cause ascyning issues
    try {
        await Promise.all(pages.map((page) =>pool.query(`INSERT INTO ${table}(link,count) VALUES(${sql.escape(page[0])}, ${page[1]})`)));
        console.log(`Table filled`);
    } catch (error) {
        console.log(error.message);
    };
};

// Defunct and should only be used manually if can't to MySQL
// Generates a user friendly list of internal links and their count to console
function printReport(pages) {
    const sortedPages = sortPages(pages);

    console.log(`#==========#`);
    console.log(`Report Start`);
    console.log(`#==========#`);
    for (const sortedPage of sortedPages) {
        console.log(`${sortedPage[1]} counts of ${sortedPage[0]}`) ;
    };
    console.log(`#=========#`);
    console.log(`Report End`);
    console.log(`#=========#`);
};

// Sorts given object by frequency in which internal links appear
function sortPages(pages) {
    // Turns object into array storing the dictionary as another array
    let pagesArray = [];
    for (const page in pages) {
        pagesArray.push([page, pages[page]]);
    };

    // Sort numerically, highest to lowest
    pagesArray.sort(function(a,b){return b[1] - a[1]});

    return pagesArray;
};

export {GenerateReport, printReport, sortPages, createDatabase};