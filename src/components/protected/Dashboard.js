import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import firebase from '../../config/constants';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  size: {
    width: 40,
    height: 40,
  },
  sizeIcon: {
    fontSize: 20,
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      currentUser: {},
      title: '',
      body: '',
      privacy: 'public'
    };
  }

  handleChange = event => {
    this.setState({ privacy: event.target.value });
  };

  handleSubmit(event) {
    // event.preventDefault();

    // build the post
    const newPost = {
      author: this.state.currentUser.username,
      authorPic: this.state.currentUser.profile_picture,
      body: this.state.body,
      stars: {},
      title: this.state.title,
      privacy: this.state.privacy,
      uid: this.state.currentUser.uid
    };

    // post to posts and user-posts
    this.dbRefPosts.push(newPost).then((snap) => {
      const key = snap.key;
      const path = '/user-posts/' + this.state.currentUser.uid + '/' + key;
      firebase.database().ref(path).set(newPost);
    });
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
        <FormControlLabel
          value="female"
          control={<Radio
            checked={this.state.privacy === 'public'}
            onChange={this.handleChange}
            value="public"
            name="radio-button-demo"
            aria-label="A"
          />}
          label="Public"
        />
        <FormControlLabel
          value="male"
          control={<Radio
            checked={this.state.privacy === 'private'}
            onChange={this.handleChange}
            value="private"
            name="radio-button-demo"
            aria-label="B"
          />}
          label="Private"
        />
        <FormControlLabel
          value="other"
          control={<Radio
            checked={this.state.privacy === 'followers'}
            onChange={this.handleChange}
            value="followers"
            name="radio-button-demo"
            aria-label="C"
          />}
          label="Followers"
        />
        <br />
        <Button
          style={style.raisedBtn}
          type="submit"
        >Submit</ Button>
      </form>
    );
  }

  setUser(user) {
    // if user not in db: add him
    firebase.database().ref('/users/' + user.uid).on('value', (snap) => {
      if (!snap.val()) {
        firebase.database().ref('/users/' + user.uid).set({
          email: user.email,
          profile_picture: user.photoURL,
          username: user.displayName
        });
      }
    });

    // add user info to state
    this.setState({ currentUser: {
      uid: user.uid,
      email: user.email,
      profile_picture: user.photoURL,
      username: user.displayName
    } });
  }

  componentDidMount() {
    // posts
    this.dbRefPosts = firebase.database().ref('/posts');

    // user-posts
    // this.dbRefUserPosts = firebase.database().ref('/user-posts');

    // other verifications
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }
  }

  componentWillUnmount() {
    // posts
    // this.dbRefPosts.off('value', this.dbCallbackPosts);
    // user-posts
    // this.dbRefUserPosts.off('value', this.dbCallbackUserPosts);
  }
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
