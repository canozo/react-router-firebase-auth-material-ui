import firebase from '../config/constants';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

class CardPreview extends Component {
  classes = {};

  constructor(props) {
    super(props)
    this.classes = props.classes;
    this.state = {
      title: props.title,
      body: props.body
    };
  }

  render() {
    return (
      <div>
      <Card className={this.classes.card}>
      <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={this.classes.avatar}>
                R
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={this.state.title}
            subheader="September 14, 2016"
          />
        <CardMedia
          className={this.classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            Lizard
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
}

class Home extends Component {
  classes = {};

  constructor(props) {
    super(props)
    this.classes = props.classes;
    this.state = {
      posts: {}
    };
  }

  render() {
    if (this.state.posts) {
      var result = [];
      for (let key in this.state.posts) {
        let post = this.state.posts[key]
        result.push(<CardPreview
          key={key}
          classes={this.classes}
          title={post.title}
          body={post.body}
        />);
      }
      return result;
    } else {
      return (
        <div>loading</div>
      );
    }
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref('/posts');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {
      this.setState({ posts: snap.val() });
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off('value', this.firebaseCallback);
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

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
