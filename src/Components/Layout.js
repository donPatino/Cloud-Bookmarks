import React from 'react';
import { Container, Box, Grid } from '@material-ui/core';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Header from './Header';

const Layout = ({children}) => (
    <AmplifyAuthenticator
        style={{
            display: 'flex',
            justifyContent: 'center',
        }}
        usernameAlias="email"
    >
        <AmplifySignIn  headerText="Sign in to use your Cloud Bookmarks" slot="sign-in"></AmplifySignIn>
        <Router>
            <Header />

            <Container>
                <Grid container direction="column" alignItems="center">
                    <Grid item>
                        <div className="spacer">
                            some shit
                        </div>
                    </Grid>
                    <Switch>
                        {children}
                    </Switch>
                </Grid>
            </Container>
            
            {/* </Box > */}
            
        </Router>
    </AmplifyAuthenticator>
)

export default Layout;