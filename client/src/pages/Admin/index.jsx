import React, { Children } from 'react'

import {Tabs} from "antd";
import TheatreTable from './TheatreTable';
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
        children : <TheatreTable />

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
