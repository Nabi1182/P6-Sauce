const Users = require('../models/ModelsUsers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = (req, res, next) => {
	bcrypt.hash(req.body.password, parseInt(process.env.HASH_SALT) )
	.then(hash => {
		const user = new Users({
			email : req.body.email,
			password: hash
		})
		user.save()
		.then(() => res.status(201).json({message : 'Utilisateur créer'}))
		.catch(error => res.status(400).json({error}))
	})
	.catch(error => res.status(500).json({error}))
}

exports.loginUser = (req,res,next) =>{

	Users.findOne({email: req.body.email})
	.then(Users => {
		if (Users === null) {
			res.status(401).json({message : 'Identifiant ou mot de passe incorrecte'})
		} else{
			bcrypt.compare(req.body.password, Users.password)
			.then(valid =>{
				if(!valid){
					res.status(401).json({message: 'Identifiant ou mot de passe incorrecte'})
				} else{
					res.status(200).json({
						userId : Users._id,
						token : jwt.sign(
							{ userId: Users._id },
							process.env.PASSPHRASE,
							{ expiresIn: '24h' }
							
						)
					})
				}
			})
			.catch(error => res.status(500).json({error}))
		}
	})
	.catch(error => res.status(500).json({error}))
}

