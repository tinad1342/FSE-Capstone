import express from "express";
import fs from 'fs';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = fs.readFileSync("queries.json", "utf8");
        res.status(200);
        res.send(data);
    } catch (err) {
        res.status(404);
        res.send(err);
    }  
});

router.post('/', async (req, res) => {
    const savedQuery = req.body;
    const data = JSON.stringify(savedQuery);
    try {
        fs.writeFileSync("queries.json", data);
        res.status(200);
        res.send("query array saved");
    } catch (err) {
        res.status(500);
        res.send(err);
    }
});

export default router;