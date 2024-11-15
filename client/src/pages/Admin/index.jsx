import React from 'react'

import {Tabs} from "antd";
import TheatreList from '../Partner/TheatreList';
import MovieList from './MovieList';

function Admin() {
    const tableItems = [
    {
        key: "1",
        label: "Movies",
        children: <MovieList/>
    },

    {
        key: "2",
        label: "Theaters",
        children : <TheatreList isAdmin = {true} />

    }
]
  return (
    <div>
      <h1>Admin</h1>
        <Tabs items={tableItems}></Tabs>
    </div>
  );
}

export default Admin
