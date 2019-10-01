import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString('en-US');
  const newTime = new Date(date).toLocaleTimeString('en-Us');
  return `${newDate} at ${newTime}`;
};

const UserInfo = ({ session }) => (
  <div className='App'>
    <h3 className='chef-border'>Chef Profile</h3>
    <p>Username: {session.getCurrentUser.username}</p>
    <p>Email: {session.getCurrentUser.email}</p>
    <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
    <ul>
      <h4 className='chef-border'>
        {session.getCurrentUser.username}' Favorites
      </h4>
      {session.getCurrentUser.favorites.map(favorite => (
        <li key={favorite._id}>
          <Link to={`/recipes/${favorite._id}`}>
            <p className='recipeName'>{favorite.name}</p>
          </Link>
        </li>
      ))}
      {!session.getCurrentUser.favorites.length && (
        <p className='likes'>
          <strong>
            You have no favorites yet! Go find some you really love!
          </strong>
          <span role='img' aria-label='Like'>
            👍
          </span>
        </p>
      )}
    </ul>
  </div>
);

export default UserInfo;
