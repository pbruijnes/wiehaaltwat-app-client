import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton.jsx";
import config from "../config";
import { s3Upload } from "../libs/awsLib";

export default class Items extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
        isLoading: null,
        isDeleting: null,
        item: null,
        content: "",
        attachmentURL: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
        let attachmentURL;
        const item = await this.getItem();
        const { content, attachment } = item;

        if (attachment) {
            attachmentURL = await Storage.vault.get(attachment);
        }

        this.setState({
            item,
            content,
            attachmentURL
        });
    } catch (e) {
        alert(e);
    }
  }

  getItem() {
    return API.get("items", `/items/${this.props.match.params.id}`);
  }

  validateForm() {
      return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange(event){
    this.setState({
        [event.target.id]: event.target.value
    });
  }

  handleFileChange(event){
    this.file = event.target.files[0];
  }

  async handleSubmit(event){
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
        alert("Please pick a file smaller than 5MB");
        return;
    }

    this.setState({ isLoading: true });
  }

  deleteItem() {
    return API.del("items", `/items/${this.props.match.params.id}`);
  }

  async handleDelete(event){
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteItem();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  saveItem(item) {
    return API.put("items", `/items/${this.props.match.params.id}`, {
      body: item
    });
  }

  async handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
        alert("Please pick a file smaller than 5MB");
        return;
    }

    this.setState({ isLoading: true });

    try {
        if (this.file) {
          attachment = await s3Upload(this.file);
        }

        await this.saveItem({
          content: this.state.content,
          attachment: attachment || this.state.item.attachment
        });
        this.props.history.push("/");
    } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
    }
  }
  render() {
    return (
      <div className="Items">
        {this.state.item &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.item.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.item.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.item.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="success"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
