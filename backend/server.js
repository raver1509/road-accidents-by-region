import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import Voivodeship from "./models/voivodeship.model.js";
import iconv from 'iconv-lite';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

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

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({error: "Unauthorized: Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({ error: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

app.use(express.urlencoded({ extended: true })); 

console.log(process.env.MONGO_URI);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectMongoDB();
});