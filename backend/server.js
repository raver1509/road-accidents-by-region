import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import Voivodeship from "./models/voivodeship.model.js";
import iconv from 'iconv-lite';
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const port = 3000;
app.use(cookieParser());

app.use(express.json({ limit: "100mb" }));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));;
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get('/retrieveData', async (req, res) => {
    try {
        const data = await Voivodeship.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving the data' });
    }
});

app.post('/saveData', async (req, res) => {
    const { name, stats2018, stats2023 } = req.body;

    try {
        let voivodeship = await Voivodeship.findOne({ name });

        if (voivodeship) {
            if (stats2018) {
                voivodeship.stats2018 = stats2018;
            }
            if (stats2023) {
                voivodeship.stats2023 = stats2023;
            }
            await voivodeship.save();
            return res.status(200).json(voivodeship);
        }

        voivodeship = new Voivodeship({
            name,
            stats2018: stats2018 || {},
            stats2023: stats2023 || {}
        });

        await voivodeship.save();
        res.status(201).json(voivodeship);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: 'An error occurred while saving the data' });
    }
});


app.get('/govData2023', async (req, res) => {
    try {
        const response = await fetch('https://api.dane.gov.pl/media/resources/20240408/Zdarzenia_w_ruchu_drogowych_w_2023_r._-_podzia%C5%82_na_wojew%C3%B3dztwa.csv');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const data = iconv.decode(Buffer.from(buffer), 'windows-1250');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/govData2018', async (req, res) => {
    try {
        const response = await fetch('https://dane.gov.pl/media/resources/20190319/Wojew%C3%B3dztwa.csv');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const data = iconv.decode(Buffer.from(buffer), 'windows-1250');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});


console.log(process.env.MONGO_URI);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectMongoDB();
});
