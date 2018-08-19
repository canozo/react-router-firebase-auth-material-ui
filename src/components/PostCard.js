import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import firebase from '../config/constants';

class PostCard extends Component {
  classes = {};

  constructor(props) {
    super(props);
    this.handleStars = this.handleStars.bind(this);
    this.classes = props.classes;

    this.state = {
      currentUser: props.currentUser,
      key: props.postid,
      author: '',
      authorPic: '',
      privacy: '',
      title: '',
      body: '',
      stars: {}
    };
  }

  handleStars(event) {
    var starry = {};
    // db reference
    var dbRef = firebase.database().ref('/posts/' + this.state.key);

    // get initial state
    var updates = {
      author: this.state.author,
      authorPic: this.state.authorPic,
      body: this.state.body,
      privacy: this.state.privacy,
      title: this.state.title,
      uid: this.state.uid
    }

    if (!this.state.stars) {
      // no stars have been added
      starry[this.state.currentUser.uid] = true;
    } else if (!(this.state.currentUser.uid in this.state.stars)) {
      // stars have been added but maybe the user hasn't added any
      starry = this.state.stars;
      starry[this.state.currentUser.uid] = true;
    } else {
      // user has added stars
      starry = this.state.stars;
      starry[this.state.currentUser.uid] = !this.state.stars[this.state.currentUser.uid];
    }
    // update db and state
    updates.stars = starry;
    dbRef.update(updates).then(() => {
      const path = '/user-posts/' + this.state.uid + '/' + this.state.key;
      firebase.database().ref(path).update(updates);
    });
    this.setState({ stars: starry });
  }

  countStars() {
    var count = 0;
    for (let key in this.state.stars) {
      if (this.state.stars[key]) {
        count += 1;
      }
    }
    return count;
  }

  render() {
    return (
      <div>
        <Card className={this.classes.card}>
          <CardHeader
            avatar={
              <Avatar
                alt="Remy Sharp"
                src={this.state.authorPic}
                className={this.classes.avatar}
              />
            }
            action={
              <IconButton onClick={this.handleStars}>
                <StarIcon />
              </IconButton>
            }
            title={this.state.author}
            subheader={'Star count: ' + (this.state.stars ? this.countStars() : 0)}
          />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {this.state.title}
          </Typography>
          <Typography component="p">
            {this.state.body}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
      </div>
    );
  }

  componentDidMount() {
    // posts
    this.dbRefPost = firebase.database().ref('/posts/' + this.state.key);
    this.dbCallbackPost = this.dbRefPost.on('value', (snap) => {
      this.setState(snap.val());
    });

    // user-posts
    this.dbRefUserPost = firebase.database().ref('/user-posts/' + this.state.key);
    this.dbCallbackUserPost = this.dbRefUserPost.on('value', (snap) => {
      this.setState(snap.val());
    });
  }

  componentWillUnmount() {
    // posts
    this.dbRefPost.off('value', this.dbCallbackPost);
    // users
    this.dbRefUserPost.off('value', this.dbCallbackUserPost);
  }
}

export default PostCard;