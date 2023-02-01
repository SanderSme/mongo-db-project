import express from 'express';
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config()
// creating my express server
const app = express();
const PORT = 7777;

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// create a schema for the devices collection
const CarSchema = new mongoose.Schema({
    car_modal: String,
    car_make: String,
    CarTopSpees: Number,
    Year: Number
});

// create a model based on the schema
const Car = mongoose.model('Car', CarSchema);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We're connected to the database <3 <3 !");
});

// create a new device
app.post('/createcar', async (req, res) => {
    console.log(req.body)
    const car = new Car(req.body);
    try {
        const savedCar = await car.save();
        res.send(savedCar);
    } catch (error) {
        res.status(400).send(error);
    }
});

// read all devices
app.get('/getallcars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.send(cars);
    } catch (error) {
        res.status(400).send(error);
    }
});

// update a specific device
app.patch('/car/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!car) res.status(404).send('Car not found.');
        res.send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete a specific device
app.delete('/car/:id', async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) res.status(404).send('Car not found.');
        res.send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
});
