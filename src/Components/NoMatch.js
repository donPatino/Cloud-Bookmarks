import React, {useEffect} from 'react';
import {Grid} from '@material-ui/core';
import {Link} from "react-router-dom";

let NoMatch = ({location}) => {
  useEffect(() => {
    console.log(location);
    console.log("You're at "+location.pathname);
  }, [location]);
  return (
    <Grid item>
      <h3>Welcome to {location.pathname}</h3>
      <p>I think you're lost.<br/> Try going {<Link to="/">home</Link>}</p>
      </Grid>
  );
};

export default NoMatch;