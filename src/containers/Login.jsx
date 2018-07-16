import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton.jsx";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
          isLoading: false,
          email: "",
          password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange(event){
    this.setState({
        [event.target.id]: event.target.value
    });
  }

  async handleSubmit(event){
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
        await Auth.signIn(this.state.email, this.state.password);
        this.props.userHasAuthenticated(true);
    } catch (e) {
        alert(e.message);
        this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="Login">
          <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    autoFocus
                    type="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                  />
              </FormGroup>
              <LoaderButton
                  block
                  bsSize="large"
                  disabled={!this.validateForm()}
                  type="submit"
                  isLoading={this.state.isLoading}
                  text="Login"
                  loadingText="Logging in…"
              />
          </form>
      </div>
    );
  }
}
