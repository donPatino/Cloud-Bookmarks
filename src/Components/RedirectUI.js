import React, {useState, useEffect} from 'react';

import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import {Grid} from '@material-ui/core';

import { DataStore } from '@aws-amplify/datastore';
import { Link } from '../models';

const queryLink = async (key, setDestination) => {
    console.log(key);
    const links = await DataStore.query(Link, c =>
      c.key("eq", key)
    );

    if (links.length === 1) {
        console.log("Link found");
        // return links[0].destination;
        setDestination(links[0].destination);
    } else if (links.length === 0) {
        console.log("No Link found");
        // setDestination('');
    } else {
        console.log("Too many links");
        throw new Error("Bad query");
    }
};

let FinalRedirect = () => {
  let {key} = useParams();
  let [destination, setDestination] = useState();

  // Look up key if valid redirect to that url.
  // if not valid display error.
  useEffect(() => {
    queryLink(key, setDestination);
  }, [key, destination]);

  useEffect(() => {
    if (destination) {
      window.location.href = destination;
    }
  }, [destination]);

  // Add a test value (e.g. ?debug=true)

  return(
    <React.Fragment>
      { destination ? (
        <React.Fragment>
          <p>... Redirecting to {destination}</p>
        </React.Fragment>
        ) : (
        <React.Fragment>
          <p>Obtaining Url</p>
        </React.Fragment>
        )
      }
    </React.Fragment>
  );
  
};

let RedirectUI = () => {

  let { path } = useRouteMatch();

  return(
    <Grid item>
      <Switch>
        <Route exact path={path}>
          <p>Error: No key provided.</p>
        </Route>
        
        <Route path={`${path}/:key`}>
          <FinalRedirect/>
        </Route>
      </Switch>
    </Grid>
  );
};

export default RedirectUI;