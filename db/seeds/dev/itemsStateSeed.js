
exports.seed = (knex, Promise) => {
  return knex('items_state').del()
    .then( () => {
      return knex('items_state').insert([
        {id: 1, cleanliness: 'sparkling'},
        {id: 2, cleanliness: 'dusty'},
        {id: 3, cleanliness: 'rancid'}
      ]);
    });
};
