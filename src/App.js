import {BrowserRouter as Router, Switch, Route} from 'react-router-dom' 
import Feed from './Feed.js'
import Profile from './Profile.js'
import Login from './Login.js'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Feed}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/:username" component={Profile}/>
      </Switch>
    </Router>
  );
}

export default App;
