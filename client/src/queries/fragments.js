import { gql } from 'apollo-boost';

export const recipeFragments = {
  recipe: gql`
    fragment CompleteRecipe on Recipe {
      _id
      name
      imageUrl
      category
      mealType
      description
      ingredients
      instructions
      createdDate
      likes
      username
    }
  `,
  like: gql`
    fragment LikeRecipe on Recipe {
      _id
      likes
    }
  `
};