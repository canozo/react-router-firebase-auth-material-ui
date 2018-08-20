import firebase from '../../config/constants';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PostCard from '../PostCard';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class MyPosts extends Component {
  classes = {};

  constructor(props) {
    super(props)
    this.classes = props.classes;
    this.state = {
      currentUser: {},
      posts: {},
      users: {}
    };
  }

  verifyPrivate(post) {
    if (post.uid !== this.state.currentUser.uid) {
      // the post wasn't made by you
      return false;
    }

    // the post was made by you
    return true;
  }

  render() {
    var result = [];
    if (this.state.posts) {
      for (let key in this.state.posts) {
        let post = this.state.posts[key];
        // only show posts you've made
        if (this.verifyPrivate(post)) {
          result.push(<PostCard
            key={key}
            postid={key}
            uid={post.uid}
            currentUser={this.state.currentUser}
            classes={this.classes}
          />);
        }
      }
      return result;
    } else {
      return (
        <div>There's nothing here yet!</div>
      );
    }
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
    this.dbCallbackPosts = this.dbRefPosts.on('value', (snap) => {
      this.setState({ posts: snap.val() });
    });

    // users
    this.dbRefUsers = firebase.database().ref('/users');
    this.dbCallbackUsers = this.dbRefUsers.on('value', (snap) => {
      this.setState({ users: snap.val() });
    });

    // other verifications
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }
  }

  componentWillUnmount() {
    // posts
    this.dbRefPosts.off('value', this.dbCallbackPosts);
    // users
    this.dbRefUsers.off('value', this.dbCallbackUsers);
  }
}

MyPosts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyPosts);
