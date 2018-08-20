import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import TextField from '@material-ui/core/TextField';
import firebase from '../config/constants';
import Comment from './Comment';
import './idk.css';

class PostCard extends Component {
  classes = {};

  constructor(props) {
    super(props);
    this.handleStars = this.handleStars.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.followStatus = this.followStatus.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.classes = props.classes;

    this.state = {
      uid: props.uid,
      currentUser: props.currentUser,
      key: props.postid,
      datetime: props.datetime,
      author: '',
      authorPic: '',
      privacy: '',
      title: '',
      body: '',
      stars: {},
      followers: {},
      comments: {},
      commentDraft: ''
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

  handleComment(event) {
    // original comments
    var updatedComments = this.state.comments || {};
    // new comment
    const newComment = {
      author: this.state.currentUser.username,
      text: this.state.commentDraft,
      uid: this.state.currentUser.uid
    };

    // push new comment to db
    this.dbRefComments.push(newComment).then((snap) => {
      // get new comment key and add it to state
      const key = snap.key;
      updatedComments[key] = newComment;
      this.setState(updatedComments);
      this.setState({ commentDraft: '' });
    });
  }

  handleFollow(event) {
    var followy = {};

    if (!this.state.followers) {
      // there are no followers yet so we create a new node
      followy[this.state.currentUser.uid] = true;
    } else if (!(this.state.currentUser.uid in this.state.followers)) {
      // there are followers but the user isnt' following
      followy = this.state.followers;
      followy[this.state.currentUser.uid] = true;
    } else {
      // there are followers and the user has followed, invert result
      followy = this.state.followers;
      followy[this.state.currentUser.uid] = !this.state.followers[this.state.currentUser.uid];
    }
    // update db and state
    this.dbRefFollowers.update(followy);
    this.setState({ followers: followy });
  }

  followStatus() {
    if (this.state.followers
      && this.state.currentUser.uid in this.state.followers
      && this.state.followers[this.state.currentUser.uid] === true) {
        return 'Unfollow';
      } else {
        return 'Follow';
      }
  }

  render() {
    var comments = [];
    for (let key in this.state.comments) {
      let comment = this.state.comments[key];
      comments.push(<Comment
        key={key}
        author={comment.author}
        text={comment.text}
        uid={comment.uid}
      />);
    }
    return (
      <div className='row' dateTime={this.state.datetime.toString()}>
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
          <br/>
          {comments}
          <br/>
          <Typography component="p">
            Add a comment:
          </Typography>
          <TextField
            value={this.state.commentDraft}
            hinttext="Enter your comment"
            floatinglabeltext="Comment"
            onChange={(event) => this.setState({ commentDraft: event.target.value })}
          />
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.handleComment}>
            Post comment
          </Button>
          <Button size="small" color="primary" onClick={this.handleFollow}>
            { this.followStatus() }
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

    // followers
    this.dbRefFollowers = firebase.database().ref('/followers/' + this.state.uid);
    this.dbCallbackFollowers = this.dbRefFollowers.on('value', (snap) => {
      this.setState({ followers: snap.val() });
    });

    // comments
    this.dbRefComments = firebase.database().ref('/comments/' + this.state.key);
    this.dbCallbackComments = this.dbRefComments.on('value', (snap) => {
      this.setState({ comments: snap.val() });
    });
  }

  componentWillUnmount() {
    // posts
    this.dbRefPost.off('value', this.dbCallbackPost);
    // users
    this.dbRefUserPost.off('value', this.dbCallbackUserPost);
    // followers
    this.dbRefFollowers.off('value', this.dbCallbackFollowers);
    // comments
    this.dbRefComments.off('value', this.dbCallbackComments);
  }
}

export default PostCard;