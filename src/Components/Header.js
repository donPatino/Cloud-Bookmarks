import React from 'react';

import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { NavLink } from "react-router-dom";

const Header = () => (
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
)

export default Header;