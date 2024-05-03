import {client, connect} from './db.js';
const dbName = 'usersdb';
const collectionName = 'users';
connect(); // Connect to MongoDB
import express from "express";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const prj = {user:1,email:1, _id:0}
        const users = await collection.find({}).project(prj).toArray();
        res.json(users);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }   
});

router.post('/authenticate', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const loginCredentials = req.body;
        const users = await collection.findOne({"user": loginCredentials.user});
        if (!users) {
            res.status(401);
            res.send("Access Denied");
        } else {
            if (loginCredentials.password === users.password) {
                res.status(200);
                res.send("Authentication Successful");
            } else {
                res.status(401);
                res.send("Access Denied");
            }
        }
        } catch (err) {
        res.status(500).json({ error: err.message });
        }   
});

export default router;