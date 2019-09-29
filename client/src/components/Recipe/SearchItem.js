import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ _id, name, likes }) => (
  <li>
    <Link to={`/recipes/${_id}`}>
      <h4 className='recipeName'>{name}</h4>
    </Link>
    <p className='likes'>Likes: {likes}</p>
  </li>
);

export default SearchItem;