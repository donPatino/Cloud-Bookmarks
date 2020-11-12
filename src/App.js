import React, {useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';

import Auth from '@aws-amplify/auth';
import { DataStore, Predicates } from '@aws-amplify/datastore';

import { Link } from './models';

import { Route } from "react-router-dom";

import LinkTable from './Components/LinkTable';
import AddLink from './Components/AddLink';
import RedirectUI from './Components/RedirectUI';
import NoMatch from './Components/NoMatch';
import Layout from './Components/Layout';

import Amplify, {Hub} from '@aws-amplify/core';
import awsconfig from "./aws-exports";
// import { red } from '@material-ui/core/colors';
Amplify.configure(awsconfig);

const App = () => {
  // States
  const [links, setLinks] = useState([]);
  const [nextToken, setNextToken] = useState();
  
  let linkSub = null;

  // Actions
  const subscribeLinks = () => {
    console.log("Subscribing to Links");
      linkSub = DataStore.observe(Link).subscribe(({ element, opType }) => {
      console.log('subscription', element, opType);
      const opTypeUpdaters = {
        DELETE: (users) => users.filter((user) => user.id !== element.id),
        INSERT: (users) => [element, ...users],
        UPDATE: (users) =>
          users.map((user) => (user.id === element.id ? element : user)),
      };

      setLinks(opTypeUpdaters[opType]);
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
  };

  const deleteAllLinks = async () => {
    console.log("Deleting all Links");
    let res = await DataStore.delete(Link, Predicates.ALL);
    console.log(res);
  };

  const deleteLink = async (link) => {
    console.log("Deleting a Link");
    DataStore.delete(link);
  };

  // Hooks
  useEffect(() => {
    // Start syncing datastore once a user is authenticated
    let _getLinks = async () => {
      try {
        let currentUser = await Auth.currentAuthenticatedUser();
        if (currentUser !== undefined) {
          DataStore.start();
        }
      } catch (err) {
        console.log(err);
      }
    };
    _getLinks();
  }, []);

  
  useEffect(() => {
    // Start syncing datastore at signin; clear at signout
    const removeListener = Hub.listen('auth', async (data) => {
      if (data.payload.event === 'signIn') {
        await DataStore.start();
      }
      
      if (data.payload.event === 'signOut') {
        await DataStore.clear();
      }
    });
    
    return () => {
      removeListener();
    };
  }, []);

  
  useEffect(() => {
    // Obtain links once datastore is ready (after auth)
    const removeListener = Hub.listen('datastore', async (capsule) => {
      const {payload: { event }} = capsule;
      if (event === "ready") {
        listLinks();
        return;
      }
    });
    
    listLinks();
    subscribeLinks();
    
    return () => {
      linkSub && linkSub.unsubscribe();
      removeListener();
    };
  }, []);

  return (
        <Layout>
          
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

        </Layout>
  );
};

export default App;