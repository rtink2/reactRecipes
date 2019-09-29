import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

const initialState = {
  name: '',
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
      instructions,
      mealType,
      category,
      ingredients,
      description
    } = this.state;
    const isInvalid =
      !name ||
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
      variables: { _id },
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
                <input
                  type='text'
                  name='name'
                  placeholder='Recipe Name'
                  onChange={this.handleChange}
                  value={name}
                />
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
                <input
                  type='text'
                  name='description'
                  placeholder='Add Desription'
                  onChange={this.handleChange}
                  value={description}
                />
                <input
                  type='text'
                  name='ingredients'
                  placeholder='Add Ingredients'
                  onChange={this.handleChange}
                  value={ingredients}
                />
                <textarea
                  name='instructions'
                  placeholder='Add Instructions'
                  onChange={this.handleChange}
                  value={instructions}
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
