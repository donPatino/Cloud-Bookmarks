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

            <Box className="spacer">
                <Container maxWidth="md">
                    <Grid container direction="column" alignItems="center">
                        <Switch>
                            {children}
                        </Switch>
                    </Grid>
                </Container>
            </Box >
            
        </Router>
    </AmplifyAuthenticator>
)

export default Layout;