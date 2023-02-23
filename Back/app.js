const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
/*** models***/
const usersRoutes = require('./routes/auth')
const saucesRoutes = require('./routes/sauces')
const path = require('path')
/*** Init api***/
const app = express()



/***connection mongodb***/
mongoose.set('strictQuery', false).connect(process.env.DB_ADDRESS)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors())
app.use(express.json())
//app.use(express.urlencoded({extended:true}))

/**
 * toute les route doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »).
 * Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code
* doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne
* correspond pas, renvoyer « 403: unauthorized request. »
*/

app.use('/api/auth', usersRoutes)
app.use('/api/sauces', saucesRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app
