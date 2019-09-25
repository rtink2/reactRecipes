import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { ADD_RECIPE } from '../../queries';
import Error from '../Error';

const initialState = {
  name: '',
  instructions: '',
  category: 'Breakfast',
  ingredients: '',
  description: '',
  username: ''
}
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
      // console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const {
      name,
      instructions,
      category,
      ingredients,
      description
    } = this.state;
    const isInvalid =
      !name || !instructions || !category || !ingredients || !description;
    return isInvalid;
  };
  render() {
    const {
      name,
      instructions,
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
          category,
          ingredients,
          description,
          username
        }}
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
                  name='category'
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value='Breakfast'>Breakfast</option>
                  <option value='Lunch'>Lunch</option>
                  <option value='Dinner'>Dinner</option>
                  <option value='Snack'>Snack</option>
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

export default withRouter(AddRecipe);
