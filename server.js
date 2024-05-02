/* "old" way of doing things?
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

https://stackoverflow.com/questions/46677752/the-difference-between-requirex-and-import-x
"
You can't selectively load only the pieces you need with require but with import, you can selectively load only the pieces you need, which can save memory.
Loading is synchronous(step by step) for require on the other hand import can be asynchronous(without waiting for previous import) so it can perform a little better than require.
"

https://stackoverflow.com/questions/37132031/node-js-plans-to-support-import-export-es6-ecmascript-2015-modules/37132668#37132668
"
Node.js 13.2.0 now supports ES Modules without a flag 🎉. However, the implementation is still marked as experimental so use in production with caution.
To enable ECMAScript module (ESM) support in 13.2.0, add the following to your package.json: { "type": "module" }
"
*/
import express from "express";
// import bodyParser from "body-parser"; now included as part of express.json()?
import newsRouter from './routes/news/news.js';
import usersRouter from './routes/users/users.js';
import queriesRouter from './routes/queries/queries.js'
import log from 'npmlog';

// ChatGPT, not wokring quite right
const originalLog = log.log;
log.log = function (level, prefix, message, ...args) {
    const time = new Date().toISOString();
    originalLog.call(this, level, prefix, `${time} - ${level.toUpperCase()} - ${message}`, ...args);
};

// https://stackoverflow.com/questions/32679505/node-and-express-send-json-formatted
// https://expressjs.com/en/4x/api.html#app.set
// https://stackoverflow.com/questions/47232187/express-json-vs-bodyparser-json
const app = express();
// app.use(bodyParser.json()); now included as part of express.json()?
app.use(express.json());
app.use((req, res, next) => { // ChatGPT
    log.info('access', `${req.method} ${req.path}`);
    next();
});
app.set('json spaces', 2); // supported shortcut to pretty print output

app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  log.info('app.listen', `Server listening on port ${port}`);
});