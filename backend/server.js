import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import Voivodeship from "./models/voivodeship.model.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());

app.use(express.json());

app.get('/getStats', async (req, res) => {
    try {
        const stats = await Voivodeship.find();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.post('/addStats', async (req, res) => {
    const { name, stats2018, stats2023 } = req.body;

    if (!name || !stats2018 || !stats2023) {
        return res.status(400).json({ error: 'Please provide all required fields: name, stats2018, stats2023' });
    }

    try {
        const existingVoivodeship = await Voivodeship.findOne({ name });

        if (existingVoivodeship) {
            return res.status(400).json({ error: 'Voivodeship already exists' });
        }

        const newVoivodeship = new Voivodeship({
            name,
            stats2018,
            stats2023
        });

        await newVoivodeship.save();
        res.status(201).json(newVoivodeship);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while saving the data' });
    }
});

app.get('/govData2023', async (req, res) => {
    try {
      const response = await fetch('https://api.dane.gov.pl/media/resources/20240408/Zdarzenia_w_ruchu_drogowych_w_2023_r._-_podzia%C5%82_na_wojew%C3%B3dztwa.csv');
      const data = await response.text();
      res.send(data);
    } catch (error) {
      res.status(500).send('Error fetching data');
    }
});

app.get('/govData2018', async (req, res) => {
    try {
      const response = await fetch('https://dane.gov.pl/media/resources/20190319/Wojew%C3%B3dztwa.csv');
      const data = await response.text();
      res.send(data);
    } catch (error) {
      res.status(500).send('Error fetching data');
    }
});

console.log(process.env.MONGO_URI);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectMongoDB();
});