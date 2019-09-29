import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import Signout from './Auth/Signout';

const Navbar = ({ session }) => (
  <nav>
    {session && session.getCurrentUser ? <NavbarAuth session={session} /> : <NavbarUnAuth />}
  </nav>
);

// SIGNED IN USER
const NavbarAuth = ({ session }) => (
  <Fragment>
    <ul>
      <li>
        <NavLink to='/' exact className='myNav'>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/search' className='myNav'>
          Search
        </NavLink>
      </li>
      <li>
        <NavLink to='/recipe/add' className='myNav'>
          Add Recipe
        </NavLink>
      </li>
      <li>
        <NavLink to='/profile' className='myNav'>
          Profile
        </NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
    <h4 className='userName'>
      Welcome, <strong>{session.getCurrentUser.username}</strong>
    </h4>
  </Fragment>
);

// SIGNED OUT USER
const NavbarUnAuth = () => (
  <ul>
    <li>
      <NavLink to='/' exact>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to='search' className='myNav'>
        Search
      </NavLink>
    </li>
    <li>
      <NavLink to='signin' className='myNav'>
        SignIn
      </NavLink>
    </li>
    <li>
      <NavLink to='signup' className='myNav'>
        SignUp
      </NavLink>
    </li>
  </ul>
);

export default Navbar;