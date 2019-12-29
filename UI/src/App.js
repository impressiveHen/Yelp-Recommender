import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Recomm from './Components/Recomm';
import NoMatch from './Components/NoMatch';
import firebase from './Components/FireBase'
import StartPage from './Components/StartPage';

function App() {
  const [idData, setIdData] = useState([]);

  useEffect(() => {
    const idRef = firebase.database().ref('/');
    idRef.on('value', (snapshot) => {
      let data = snapshot.val();
      let newIdData = []
      // Read all database data
      // for (let index in data) {
      //     newIdData.push(data[index].id)
      // }
      for (var i = 0; i < 5; i++) {
        let rand = Math.floor(Math.random() * data.length)
        newIdData.push(data[rand.toString()].id)
      }
      setIdData(newIdData);
    });
  }, [])

  return (
    <div>
      <Router basename='/'>
        <Switch>
          <Route 
            exact path='/'
            render={() => <StartPage idData={idData} />} 
          />
          <Route path='/recomm' component={Recomm} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
