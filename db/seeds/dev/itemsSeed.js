
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then( () => {
      return knex('items').insert([
        { name: 'bling', excuse:"to impress thee ladies" },
        { name: 'midget', excuse:"for entertainment" },
        { name: 'garden', excuse:"gotta eat something" }
      ]);
    });
};
