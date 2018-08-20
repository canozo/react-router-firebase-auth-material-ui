import Typography from '@material-ui/core/Typography';

class Comment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Typography component="p">
        Add a comment:
      </Typography>
    );
  }

  componentDidMount() {
    // comments
    this.dbRefComments = firebase.database().ref('/comments/' + this.state.key);
    this.dbCallbackComments = this.dbRefComments.on('value', (snap) => {
      this.setState(snap.val());
    });
  }

  componentWillUnmount() {
    // comments
    this.dbRefUserComments.off('value', this.dbCallbackComments);
  }
}