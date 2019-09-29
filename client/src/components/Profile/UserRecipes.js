import React from 'react';
import { Link } from 'react-router-dom';

import { Query, Mutation } from 'react-apollo';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from '../../queries';

const handleDelete = deleteUserRecipe => {
  const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
  if (confirmDelete) {
    deleteUserRecipe().then(({ data }) => {
      console.log(data);
    });
  }
}

const UserRecipes = ({ username }) =>  (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error}) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div className='err'>Error</div>;
        // console.log(data);
        
        return (
          <ul>
            <h3>{username}'s Recipes</h3>
            {!data.getUserRecipes.length && (
              <p className='addRecipe'>
                You have not added any recipes yet. Go add yours.
                <span role='img' aria-label='addRecipe'>
                  💬
                </span>
              </p>
            )}
            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`} className='recipeName'>
                  <p>{recipe.name}</p>
                </Link>
                <p className='likes' style={{ marginBottom: '0' }}>
                  Likes: {recipe.likes}
                </p>

                <Mutation
                  mutation={DELETE_USER_RECIPE}
                  variables={{ _id: recipe._id }}
                  refetchQueries={() => [
                    { query: GET_ALL_RECIPES },
                    { query: GET_CURRENT_USER }
                  ]}
                  update={(cache, { data: { deleteUserRecipe } }) => {
                    const { getUserRecipes } = cache.readQuery({
                      query: GET_USER_RECIPES,
                      variables: { username }
                    });
                    cache.writeQuery({
                      query: GET_USER_RECIPES,
                      variables: { username },
                      data: {
                        getUserRecipes: getUserRecipes.filter(
                          recipe => recipe._id !== deleteUserRecipe._id
                        )
                      }
                    });
                  }}
                >
                  {(deleteUserRecipe, attrs = {}) => (
                    <p
                      className='delete-button'
                      onClick={() => handleDelete(deleteUserRecipe)}
                    >
                      <strong>{attrs.loading ? 'deleting...' : 'X'}</strong>
                    </p>
                  )}
                </Mutation>
              </li>
            ))}
          </ul>
        );
      }}
    </Query>
  );

export default UserRecipes;
