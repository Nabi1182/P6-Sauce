const Sauces = require('../models/ModelsSauce')
const fs = require ('fs')

exports.createSauce = (req,res, next) =>{
	const sauceObject = JSON.parse(req.body.sauce)
	delete sauceObject._userId
	const sauce = new Sauces({
		...sauceObject,
		userId: req.auth.userId,
		imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	})
	sauce.save()
	.then(() => res.status(201).json({message: 'Objet Enregistré !'}))
	.catch(error => {
		return res.status(400).json({error})
	})
}
//Renvoie un tableau de toutes les sauces de la base de données.
exports.getSauce = (req,res, next) =>{
	Sauces.find()
	.then (sauce => res.status(200).json(sauce))
	.catch(error => res.status(404).json({error}))
}
//Renvoie la sauce avec l’_id fourni.
exports.getOneSauce = (req, res, next) => {
	Sauces.findOne({ _id: req.params.id})
	.then (sauce => res.status(200).json(sauce))
	.catch(error => res.status(404).json({error}))
}

exports.updateOneSauce = (req, res, next) => {	
	const sauceObject = req.file ? {
		...JSON.parse(req.body.sauce),
		imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : {...req.body}


	Sauces.findOne({_id: req.params.id})
		.then((sauce) => {
			if (sauce.userId != req.auth.userId){
				res.status(401).json({ message : 'Unautorized'})
			} 
			else if (req.file){
				const filename = sauce.imageUrl.split('/images/') [1]
				fs.unlink(`images/${filename}`,() =>{})
				Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
				.then(() => res.status(200).json({message : 'Objet modifié!'}))
				.catch(error => res.status(401).json({ error }))
			}
			else {
			Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
			.then(() => res.status(200).json({message : 'Objet modifié!'}))
			.catch(error => res.status(401).json({ error }));
			}	
		})
		.catch((error) => {
			res.status(400).json({ error })
		})
}

//route supprimer sauce
exports.deleteSauce = (req, res, next) =>{

	Sauces.findOne({_id: req.params.id})
	.then( sauce => {
		if (sauce.userId != req.auth.userId) {
			res.status(401).json({message : 'Unautorized request'})
		} else {
			const filename = sauce.imageUrl.split('/images/') [1];
			fs.unlink(`images/${filename}`, () => {
				Sauces.deleteOne({_id: req.params.id})
					.then(() => {res.status(200).json({message : 'Objet supprimé ! '})})
					.catch(error => res.status(400).json({error}))
			})
		}
	})	
}

//route liked
exports.likedSauce = (req, res, next) =>{
	
	Sauces.findOne({_id: req.params.id})
	.then(sauce => {
		
		switch (req.body.like){
			case -1:
				//console.log("cas -1")
				Sauces.updateOne({_id: req.params.id},
					{
						$inc : {dislikes: 1},
						$push: {usersDisliked: req.auth.userId},
						_id: req.params.id
				})
				.then(() => {res.status(200).json({message : 'Dislike ajouté'})})
				.catch(error => res.status(400).json({error}))	
				break
			case 0:
				//console.log("cas 0")
				if (sauce.usersLiked.find(user => user === req.auth.userId)) 
				{
					Sauces.updateOne({_id: req.params.id},
						{
							$inc : {likes: -1},
							$pull: {usersLiked: req.auth.userId},
							_id: req.params.id
					})
					.then(() => {res.status(200).json({message : 'Like retiré'})})
					.catch(error => res.status(400).json({error}))	
				}
				if (sauce.usersDisliked.find(user => user === req.auth.userId))
				{
					Sauces.updateOne({_id: req.params.id},
						{
							$inc : {dislikes: -1},
							$pull: {usersDisliked: req.auth.userId},
							_id: req.params.id
					})
					.then(() => {res.status(200).json({message : 'Dislike retiré'})})
					.catch(error => res.status(400).json({error}))	
				}
				break
			case 1:
				//console.log("cas 1")
				Sauces.updateOne({_id: req.params.id},
					{
						$inc : {likes: 1},
						$push: {usersLiked: req.auth.userId},
						_id: req.params.id
				})
				.then(() => {res.status(200).json({message : 'Like ajouté'})})
				.catch(error => res.status(400).json({error}))	
				break
		}
	})
}