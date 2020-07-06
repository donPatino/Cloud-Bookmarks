import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import { DataStore, Predicates } from '@aws-amplify/datastore';

import { Link } from './models';

import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import LinkTable from './Components/LinkTable';
import AddLink from './Components/AddLink';
import RedirectUI from './Components/RedirectUI';
import NoMatch from './Components/NoMatch';

import { AmplifyAuthenticator, AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import Amplify from '@aws-amplify/core';
import awsconfig from "./aws-exports";
import { red } from '@material-ui/core/colors';
Amplify.configure(awsconfig);

const App = () => {
  // States
  const [links, setLinks] = useState([]);
  const [nextToken, setNextToken] = useState();

  // Actions
  const subscribeLinks = () => {
    console.log("Subscribing to Links");
    DataStore.observe(Link).subscribe(msg => {
      listLinks();
    });
  };

  const addLink = async ({key, destination}) => {
    console.log("Adding Link");
    const res = await DataStore.save(
      new Link({key, destination})
    );
    console.log(res);
  };

  const listLinks = async () => {
    console.log("Getting Links");
    let links = await DataStore.query(Link);
    setLinks(links);
  };

  const queryLink = async (id) => {
    const link = await DataStore.query(Link, c =>
      c.key("eq", id)
    );
    console.log(link);
  }

  const deleteAllLinks = async () => {
    console.log("Deleting all Links");
    let res = await DataStore.delete(Link, Predicates.ALL);
  };

  const deleteLink = async (link) => {
    console.log("Deleting a Link");
    DataStore.delete(link);
  };

  // Hooks
  useEffect(() => {
    listLinks();
    subscribeLinks();
  }, []);

  // Need to add a sign out listener that will clear datastore

  return (
    <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignIn headerText="Sign in to use your Cloud Bookmarks" slot="sign-in"></AmplifySignIn>
    <Router>

      <AppBar>
        <Toolbar className="toolbar">
          <Typography variant="h3" className="title">
            Web Bookmarks
          </Typography>
          <Button
            component={NavLink}
            exact
            to="/"
            activeStyle={{background:"red",fontWeight:"bold"}}
          >
            Table
          </Button>
          <Button
            component={NavLink}
            to="/add"
            activeStyle={{background:"red",fontWeight:"bold"}}
          >
            Add
          </Button>
          <AmplifySignOut />
        </Toolbar>
      </AppBar>

      <div className="spacer">
        <Switch>
          <Route exact path="/">
            <LinkTable
              links={links}
              nextToken={nextToken}
              setNextToken={setNextToken}
            />
          </Route>
          
          <Route exact path="/add">
            <AddLink />
          </Route>
          
          <Route path="/r">
            <RedirectUI/>
          </Route>
          
          <Route component={NoMatch} />
          
        </Switch>
      </div>
    </Router>
    </AmplifyAuthenticator>
  );
};

export default App;