const express = require("express");
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauce.routes");

mongoose
	.connect("mongodb+srv://alexis:hottakesPWD@cluster0.5iykr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch(() => console.log("Cannot connect to MongoDB"));

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());

app.use("/api/stuff", sauceRoutes);

module.exports = app;
