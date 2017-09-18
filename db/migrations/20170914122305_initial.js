
exports.up = (knex, Promise) => {
  return Promise.all([
		 knex.schema.createTable('items_state', table => {
		 	table.increments('id').primary()
		 	table.string('cleanliness')

		 	table.timestamps(true, true)
		 }),

		knex.schema.createTable('items', table => {
 		table.increments('id').primary()
 		table.string('name')
 		table.string('excuse')
 		table.string('item_state')
 		table.integer('item_state_id').unsigned()
 		table.foreign('item_state_id').references('items_state.id')

 		table.timestamps(true, true)
 	})
	])
};

exports.down = (knex, Promise) => {
  return Promise.all([
  	knex.schema.dropTable('items'),
  	knex.schema.dropTable('items_state')
  	])
};
