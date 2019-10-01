import React from 'react';
import { withRouter } from 'react-router-dom';

import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';
import Spinner from '../Spinner';

const RecipePage = ({ match }) => {
  const { _id } = match.params;

  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div className='err'>Error</div>;
        return (
          <div className='App'>
            <div
              style={{
                background: `url(${data.getRecipe.imageUrl}) center center / cover no-repeat`
              }}
              className='recipe-image'
            ></div>
            <div className='recipe'>
              <div className='recipe-header'>
                <div className='recipe-name'>
                  <h3>
                    <strong>{data.getRecipe.name}</strong>
                  </h3>
                  <h4>
                    <strong>{data.getRecipe.mealType}</strong>
                    {'|'}
                    <strong>{data.getRecipe.category}</strong>
                  </h4>
                  <p>
                    Created By: <strong>{data.getRecipe.username}</strong>
                  </p>
                </div>
                <p>
                  {data.getRecipe.likes}
                  <span role='img' aria-label='heart'>
                    ❤️
                  </span>
                </p>
                <blockquote className='recipe-description'>
                  {data.getRecipe.description}
                </blockquote>
                <h3 className='recipe-instructions__title'>Igredients</h3>
                <div
                  className='recipe-description'
                  // dangerouslySetInnerHTML={{
                  //   __html: data.getRecipe.ingredients
                  // }}
                >
                  {data.getRecipe.ingredients}
                </div>
                <h3 className='recipe-instructions__title'>Instructions</h3>
                <div
                  className='recipe-instructions'
                  dangerouslySetInnerHTML={{
                    __html: data.getRecipe.instructions
                  }}
                ></div>
              </div>
              <LikeRecipe _id={_id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(RecipePage);
