import { scrapePage } from "./scrape.js";
import { GenerateReport, printReport } from "./report.js";

async function main() {
    const argv = process.argv.splice(2);

    console.log(`Scraping ${argv} for URL's, please wait...`);
    
    const results = await scrapePage(argv);
    
    GenerateReport(results, argv);
};

main();

// npm run start https://wagslane.dev (for WSL)
// node main.js https://wagslane.dev (for Windows)