import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';

import { Query, Mutation } from 'react-apollo';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
  UPDATE_USER_RECIPE
} from '../../queries';
import Spinner from '../Spinner';

class UserRecipes extends Component {
  state = {
    _id: '',
    name: '',
    mealType: '',
    imageUrl: '',
    category: '',
    ingredients: '',
    description: '',
    modal: false
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this recipe?'
    );
    if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => {});
    }
  };

  handleSubmit = (event, updateUserRecipe) => {
    event.preventDefault();
    updateUserRecipe().then(({ data }) => {
      // console.log(data);
      this.closeModal();
    });
  };

  loadRecipe = recipe => {
    this.setState({ ...recipe, modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleEditorIgredientsChange = event => {
    const newContent = event.editor.getData();
    this.setState({ ingredients: newContent });
  };

  handleEditorInstructionsChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div className='err'>Error</div>;

          return (
            <ul>
              {modal && (
                <EditRecipeModal
                  handleSubmit={this.handleSubmit}
                  recipe={this.state}
                  closeModal={this.closeModal}
                  handleChange={this.handleChange}
                />
              )}
              <h4 className='chef-border'>{username}'s Recipes</h4>
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
                      <div>
                        <button
                          className='update-button'
                          onClick={() => this.loadRecipe(recipe)}
                        >
                          Update
                        </button>
                        <p
                          className='delete-button'
                          onClick={() => this.handleDelete(deleteUserRecipe)}
                        >
                          <strong>
                            {attrs.loading ? 'deleting...' : '❌'}
                          </strong>
                        </p>
                      </div>
                    )}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }
}

const EditRecipeModal = ({
  handleSubmit,
  recipe,
  handleChange,
  closeModal,
  // handleEditorIgredientsChange,
  handleEditorInstructionsChange
}) => (
  <Mutation
    mutation={UPDATE_USER_RECIPE}
    variables={{
      _id: recipe._id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      mealType: recipe.mealType,
      category: recipe.category,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    }}
  >
    {updateUserRecipe => (
      <div className='modal modal-open'>
        <div className='modal-inner'>
          <div className='modal-content'>
            <form
              onSubmit={event => handleSubmit(event, updateUserRecipe)}
              className='modal-content-inner'
            >
              <h4>Edit Recipe</h4>
              <label htmlFor='name'>Recipe Name</label>
              <input
                type='text'
                name='name'
                placeholder='Add Recipe Name'
                onChange={handleChange}
                value={recipe.name}
              />
              <label htmlFor='imageUrl'>Recipe Image</label>
              <input
                type='text'
                name='imageUrl'
                placeholder='Add Image URL'
                onChange={handleChange}
                value={recipe.imageUrl}
              />
              <label htmlFor='category'>Meal Type</label>
              <select
                name='mealType'
                onChange={handleChange}
                value={recipe.mealType}
              >
                <option value='Breakfast'>Breakfast</option>
                <option value='Lunch'>Lunch</option>
                <option value='Dinner'>Dinner</option>
                <option value='Dessert'>Dessert</option>
                <option value='Snack'>Snack</option>
                <option value='Cocktails'>Cocktails</option>
              </select>
              <label htmlFor='category'>Category of Recipe</label>
              <select
                name='category'
                onChange={handleChange}
                value={recipe.category}
              >
                <option value='WorldCuisine'>World Cuisine</option>
                <option value='Mexican'>Mexican</option>
                <option value='African'>African</option>
                <option value='LatinAmercian'>Latin Amercian</option>
                <option value='Jewish'>Jewish</option>
                <option value='French'>French</option>
                <option value='German'>German</option>
                <option value='Greek'>Greek</option>
                <option value='Dutch'>Dutch</option>
                <option value='Danish'>Danish</option>
                <option value='Belgian'>Belgian</option>
                <option value='Swiss'>Swiss</option>
                <option value='Scandianvian'>Scandianvian</option>
                <option value='Portuguese'>Portuguese</option>
                <option value='Chinese'>Chinese</option>
                <option value='Italian'>Italian</option>
                <option value='Indian'>Indian</option>
                <option value='Southern'>Southern</option>
                <option value='Thai'>Thai</option>
                <option value='Spanish'>Spanish</option>
                <option value='Canadian'>Canadian</option>
                <option value='American'>American</option>
              </select>
              <label htmlFor='description'>Recipe Description</label>
              <input
                type='text'
                name='description'
                placeholder='Add Desription'
                onChange={handleChange}
                value={recipe.description}
              />
              <label htmlFor='instructions'>Add Ingredients</label>
              <input
                type='text'
                name='ingredients'
                placeholder='Add Ingredients'
                onChange={handleChange}
                value={recipe.ingredients}
              />
              {/* <label htmlFor='ingredients'>Add Ingredients</label>
                <CKEditor
                  name='ingredients'
                  content={ingredients}
                  events={{ change: this.handleEditorIngredientsChange }}
                /> */}
              <label htmlFor='instructions'>Add Instructions</label>
              <CKEditor
                name='instructions'
                content={recipe.instructions}
                events={{ change: handleEditorInstructionsChange }}
              />
              <hr />
              <div className='modal-buttons'>
                <button type='submit' className='update-button'>
                  Update
                </button>
                <button onClick={closeModal} className='other-button'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </Mutation>
);

export default UserRecipes;
