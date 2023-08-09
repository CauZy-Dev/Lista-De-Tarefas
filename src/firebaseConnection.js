import { initializeApp} from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDMMPXNvrHvFp_sWfuYfKGTj8pirmL4PuA",
  authDomain: "curso-65533.firebaseapp.com",
  projectId: "curso-65533",
  storageBucket: "curso-65533.appspot.com",
  messagingSenderId: "161589542824",
  appId: "1:161589542824:web:c9d08ad88029f8df32279d",
  measurementId: "G-Q24R0FCE7S"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);


export{db,auth};