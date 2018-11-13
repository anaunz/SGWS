import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
  apiKey: 'AIzaSyDIOkxalv-Ye9e9iTKVMqN2UWxAvkI2gQ0',
  authDomain: 'sgws-c9237.firebaseapp.com',
  databaseURL: 'https://sgws-c9237.firebaseio.com',
  projectId: 'sgws-c9237',
  storageBucket: 'sgws-c9237.appspot.com',
  messagingSenderId: '276757500542'
}

const firebaseApp = firebase.initializeApp(config)

firebase.firestore().settings({
  timestampsInSnapshots: true
})

export default firebaseApp.firestore()
