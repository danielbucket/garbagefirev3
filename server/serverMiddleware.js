const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)


const getItemState = (req, res, next) => {
	const id = req.body.item_state_id;

	db('items_state').where('id', id).select("cleanliness")
	.then(cleanliness => {
		return Object.assign(req.body, { item_state:cleanliness[0].cleanliness }) 
	})
	.then( () => next() )
	.catch(error => res.status(500).json({ error }))
}


module.exports = {
	getItemState
}