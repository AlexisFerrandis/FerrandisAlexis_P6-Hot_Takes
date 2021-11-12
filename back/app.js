const express = require("express");
const mongoose = require("mongoose");
const Sauce = require("./models/sauce");

const app = express();

mongoose
	.connect("mongodb+srv://alexis:hottakesPWD@cluster0.5iykr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch(() => console.log("Cannot connect to MongoDB"));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());

app.post("/api/sauces", (req, res, next) => {
	delete req.body._id;
	const sauce = new Sauce({
		...req.body,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce saved" }))
		.catch((error) => res.status(400).json({ error }));
});

app.use("/api/auth/login", (req, res, next) => {
	const stuff = [
		{
			_id: "oeihfzeoi",
			title: "Mon premier objet",
			description: "Les infos de mon premier objet",
			imageUrl: "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
			price: 4900,
			userId: "qsomihvqios",
		},
		{
			_id: "oeihfzeomoihi",
			title: "Mon deuxième objet",
			description: "Les infos de mon deuxième objet",
			imageUrl: "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
			price: 2900,
			userId: "qsomihvqios",
		},
	];
	res.status(200).json(stuff);
});

module.exports = app;
