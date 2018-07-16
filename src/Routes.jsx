import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home.jsx";
import NotFound from "./containers/NotFound.jsx";
import Login from "./containers/Login.jsx";
import AppliedRoute from "./components/AppliedRoute.jsx";
import Signup from "./containers/Signup.jsx";
import NewItem from "./containers/NewItem.jsx";
import Items from "./containers/Items.jsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.jsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.jsx";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/items/new" exact component={NewItem} props={childProps} />
        <AuthenticatedRoute path="/items/:id" exact component={Items} props={childProps} />
        <Route component={NotFound} />
    </Switch>;
