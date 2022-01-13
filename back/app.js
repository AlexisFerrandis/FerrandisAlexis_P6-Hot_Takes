const express = require("express");

const mongoose = require("mongoose");

const path = require("path");
const sauceRoutes = require("./routes/sauce.routes");
const userRoutes = require("./routes/user.routes");

const mongoPWD = process.env.SECRET_MONGO_PWD;

mongoose
	.connect(`mongodb+srv://alexis:${mongoPWD}@cluster0.5iykr.mongodb.net/hotTakes?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
