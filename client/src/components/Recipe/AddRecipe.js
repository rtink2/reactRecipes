import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';
import { Mutation } from 'react-apollo';

import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

const initialState = {
  name: '',
  imageUrl: '',
  instructions: '',
  mealType: 'Breakfast',
  category: 'World Cuisine',
  ingredients: '',
  description: '',
  username: ''
};
class AddRecipe extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleEditorIgredientsChange = event => {
    const newContent = event.editor.getData();
    this.setState({ ingredients: newContent });
  };

  handleEditorInstructionsChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const {
      name,
      imageUrl,
      instructions,
      mealType,
      category,
      ingredients,
      description
    } = this.state;
    const isInvalid =
      !name ||
      !imageUrl ||
      !instructions ||
      !mealType ||
      !category ||
      !ingredients ||
      !description;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { _id } = this.props;
    const { getAllRecipes } = cache.readQuery({
      query: GET_ALL_RECIPES,
      variables: { _id }
    });

    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      },
      variables: { _id }
    });
  };

  render() {
    const {
      name,
      imageUrl,
      instructions,
      mealType,
      category,
      ingredients,
      description,
      username
    } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          name,
          imageUrl,
          instructions,
          mealType,
          category,
          ingredients,
          description,
          username
        }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className='App'>
              <h2 className='App'>Add Recipe</h2>
              <form
                className='form'
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <label htmlFor='name'>Recipe Name</label>
                <input
                  type='text'
                  name='name'
                  placeholder='Recipe Name'
                  onChange={this.handleChange}
                  value={name}
                />
                <label htmlFor='imageUrl'>Recipe Image</label>
                <input
                  type='text'
                  name='imageUrl'
                  placeholder='Recipe Image'
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <label htmlFor='imageUrl'>Meal Type</label>
                <select
                  name='mealType'
                  onChange={this.handleChange}
                  value={mealType}
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
                  onChange={this.handleChange}
                  value={category}
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
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor='description'>Add Ingredients</label>
                <input
                  type='text'
                  name='ingredients'
                  placeholder='Add Ingredients'
                  onChange={this.handleChange}
                  value={ingredients}
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
                  content={instructions}
                  events={{ change: this.handleEditorInstructionsChange }}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type='submit'
                  className='other-button'
                >
                  Add Recipe
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
