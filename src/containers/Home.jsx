import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      items: []
    };

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const items = await this.items();
      this.setState({ items });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  items() {
    return API.get("items", "/items");
  }

  renderItemsList(items) {
    return [{}].concat(items).map(
    (item, i) =>
      i !== 0
        ? <ListGroupItem
            key={item.itemId}
            href={`/items/${item.itemId}`}
            onClick={this.handleItemClick}
            header={item.content.trim().split("\n")[0]}
          >
            {"Created: " + new Date(item.createdAt).toLocaleString()}
          </ListGroupItem>
        : <ListGroupItem
            key="new"
            href="/items/new"
            onClick={this.handleItemClick}
          >
            <h4>
              <b>{"\uFF0B"}</b> Add a new item
            </h4>
          </ListGroupItem>
    );
  }

  handleItemClick (event){
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLanding() {
    return (
        <div className="landing">
          <div className="bg"></div>
          <img src="images/logo.png"/>
          <h1>WIE HAALT WAT</h1>
          <p>#neverforget</p>
          <div>
            <Link to="/login" className="btn btn-info btn-lg">
              Login
            </Link>
            <Link to="/signup" className="btn btn-success btn-lg">
              Signup
            </Link>
          </div>
        </div>
    );
  }

  renderItems() {
    return (
      <div className="items">
        <PageHeader>Wat haal jij?</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderItemsList(this.state.items)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
            {this.props.isAuthenticated ? this.renderItems() : this.renderLanding()}
      </div>
    );
  }
}
