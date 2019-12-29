// import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database'

const config = {
    apiKey: "AIzaSyBcFaFt4-fQ5pEKnMLFNCqSUv5KVoMh4_Y",
    authDomain: "yelprecommender-6864d.firebaseapp.com",
    databaseURL: "https://yelprecommender-6864d.firebaseio.com",
    projectId: "yelprecommender-6864d",
    storageBucket: "yelprecommender-6864d.appspot.com",
    messagingSenderId: "188821918678",
    appId: "1:188821918678:web:a4d3b0e472f7e8ac254a77"
}

firebase.initializeApp(config)

export default firebase;