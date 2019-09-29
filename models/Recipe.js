const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const IngredientSchema = new Schema({
//   name: String
// });

// module.exports = mongoose.model('Ingredient', IngredientSchema);

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    required: true
  },
  // ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
  ingredients: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String
  }
});

RecipeSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Recipe', RecipeSchema);
