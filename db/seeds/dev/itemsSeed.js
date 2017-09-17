
exports.seed = function(knex, Promise) {
  return knex('items').del()
  .then( () => {
    return knex('items').insert([
      { name: 'blang', excuse:"to impress thee ladies", item_state:"sparkly"},
      { name: 'midget', excuse:"for entertainment", item_state:"dusty" },
      { name: 'tub of tomatoes', excuse:"gotta eat something", item_state:"sparkly"},
      { name: 'doghouse', excuse:"for the midget", item_state:"sparkly"},
      { name: 'garden hose', excuse:"to bathe the midget", item_state:"sparkly"}
    ]);
  });
};
