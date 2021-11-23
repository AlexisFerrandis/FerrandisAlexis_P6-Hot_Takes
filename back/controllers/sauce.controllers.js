const Sauce = require("../models/Sauce");
const fs = require("fs");

// Add a new sauce and save it in db
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const usersLikedArray = new Array();
	const usersDislikedArray = new Array();
	const sauce = new Sauce({
		userId: sauceObject.userId,
		name: sauceObject.name,
		manufacturer: sauceObject.manufacturer,
		description: sauceObject.description,
		mainPepper: sauceObject.mainPepper,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		heat: sauceObject.heat,
		likes: 0,
		dislikes: 0,
		usersLiked: usersLikedArray,
		usersDisliked: usersDislikedArray,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce saved" }))
		.catch((error) => res.status(400).json({ error }));
};

// Let owner modify text and image of his sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce has been modified" }))
		.catch((error) => res.status(400).json({ error }));
};

// Let owner delete his sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce has been deleted" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// Enable like/dislike, save users in an array
exports.likeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			if (req.body.like == 1) {
				if (!sauce.usersLiked.includes(req.body.userId)) {
					sauce.usersLiked.push(req.body.userId);
					sauce.likes++;
				}
			} else if (req.body.like == 0) {
				const usersLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
				const usersDislikedIndex = sauce.usersDisliked.indexOf(req.body.userId);
				if (usersLikedIndex > -1) {
					sauce.usersLiked.splice(usersLikedIndex, 1);
					sauce.likes--;
				}
				if (usersDislikedIndex > -1) {
					sauce.usersDisliked.splice(usersDislikedIndex, 1);
					sauce.dislikes--;
				}
				console.log(sauce);
			} else if (req.body.like == -1) {
				if (!sauce.usersDisliked.includes(req.body.userId)) {
					sauce.usersDisliked.push(req.body.userId);
					sauce.dislikes++;
				}
			}
			Sauce.updateOne({ _id: req.params.id }, sauce)
				.then(() => {
					res.status(201).json({
						message: "Sauce has been liked or disliked",
					});
				})
				.catch((error) => {
					res.status(400).json({
						error: error,
					});
				});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// Display a specific sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

// Display all sauce on home
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
