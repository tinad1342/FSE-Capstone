import express from "express";
import fs from "fs";
import crypto from "crypto";
import log from 'npmlog';

// https://blog.logrocket.com/fetch-api-node-js/
// https://www.npmjs.com/package/node-fetch
// import fetch from "node-fetch";
const router = express.Router();

const apiKey = process.env.API_KEY;
if(!apiKey){
console.log("Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!");
process.exit(0);
}

const baseUrl = 'https://newsapi.org/v2/top-headlines';

function addApiKey(queryObject){
    return {...queryObject, apiKey: apiKey}
    }

export function createUrlFromQueryObject(queryObjectWithApiKey) {
    const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
    const url = baseUrl + "?" + queryString;
    return url;
    }

export async function fetchData(url) {
        let data = null;
      
        // https://odino.org/generating-the-md5-hash-of-a-string-in-nodejs/
        let urlHash = crypto.createHash("md5").update(url).digest("hex");
        let cacheFile = "news-cache/" + urlHash + ".json";
        log.info('fetchData', `urlHash: ${urlHash}, cacheFile: ${cacheFile}`);
      
        if (fs.existsSync(cacheFile)) {    
          // https://stackoverflow.com/questions/17552017/get-file-created-date-in-node
          fs.stat(cacheFile, function (err, stats) {
            // console.log(JSON.stringify(stats));
            // date math from LibertyGPT
            const currentTime = new Date().getTime();
            const modifiedTime = stats.mtime.getTime();
            const diffMs = currentTime - modifiedTime; // milliseconds??
            const diffMins = Math.floor(diffMs / (1000 * 6));      
            if (diffMins > 60) {
              log.info('fetchData', `cacheFile exists, data is stale, deleting file; diffMins: ${diffMins}`);        
              fs.unlinkSync(cacheFile);
            } else {
              data = JSON.parse(fs.readFileSync(cacheFile));
              log.info('fetchData', `cacheFile exists, data is valid (${data.length} bytes); diffMins: ${diffMins}`);        
            }
          });
        }
      
        if (data == null) {    
          try {
            const response = await fetch(url); // not natively supported in Node 14, need to use node-fetch
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
            log.info('fetchData', `retrieved data (${data.length} bytes), saving to disk`);
            fs.writeFileSync(cacheFile, JSON.stringify(data));      
          } catch (error) {
            console.error("Error fetching data:", error);
            return null;
          }
        }
      
        return data;
      }

router.get('/', async (req, res) => {
    let fixedQueryObject = {
        "country":"us",
        "q":"news"
        }
    let queryObject = addApiKey(fixedQueryObject);
    let url = createUrlFromQueryObject(queryObject);
    let newsArticles = await fetchData(url);
    res.send(newsArticles);    
});

router.post('/', async (req, res) => {
    const query = req.body;
    let queryObject = addApiKey(query);
    let url = createUrlFromQueryObject(queryObject);
    let newsArticles = await fetchData(url);
    res.send(newsArticles);    
});

export default router;