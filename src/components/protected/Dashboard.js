import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from '../../config/constants';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      privacy: ''
    };
  }

  handleSubmit(event) {
    console.log(event)
    event.preventDefault();
    // auth(this.state.email, this.state.password).catch(e =>
    //   this.setState(setErrorMsg(e))
    // );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={style.container}>
        <h3>New post</h3>
        <TextField
          hinttext="Post title"
          floatinglabeltext="Title"
          onChange={(event) => this.setState({ title: event.target.value })}
        />
        <br />
        <TextField
          hinttext="Post body"
          floatinglabeltext="Body"
          onChange={(event) => this.setState({ body: event.target.value })}
        />
        <br />
        <TextField
          hinttext="Privacy settings"
          floatinglabeltext="Privacy"
          onChange={(event) => this.setState({ privacy: event.target.value })}
        />
        <br />
        <Button
          style={style.raisedBtn}
          type="submit"
        >Submit</ Button>
      </form>
    );
  }

  componentDidMount() {
    this.dbRefPosts = firebase.database().ref('/posts');
    this.dbRefUserPosts = firebase.database().ref('/user-posts');
  }

  componentWillUnmount() {
    this.dbRefPosts.off('value', this.firebaseCallback);
    this.dbRefUserPosts.off('value', this.firebaseCallback);
  }

  /*
  <Card>
    <CardTitle title="Card title" subtitle="Card subtitle" />
    <CardText>
      <TextField
        id = "data"
        hintText="Hint Text"
        floatingLabelText="Floating Label Text"
      />
    </CardText>
    <CardActions>
      <RaisedButton label="Action1" />
      <RaisedButton label="Action2" primary={true} onClick={() => { this.prueba(); }}/>
    </CardActions>
  </Card>
  */
}

const raisedBtn = {
  margin: 15
};

const container = {
  textAlign: 'center'
};

const style = {
  raisedBtn,
  container
};

export default withStyles(styles)(Dashboard);
