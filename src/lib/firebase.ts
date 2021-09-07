import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyDhQubi_8VVQtu314HDWDW_5qbs8RbWNoI',
	authDomain: 'faveats-bff06.firebaseapp.com',
	projectId: 'faveats-bff06',
	storageBucket: 'faveats-bff06.appspot.com',
	messagingSenderId: '360230933046',
	appId: '1:360230933046:web:b082d9191e44ac15f7be97',
	measurementId: 'G-34X1L5M95C'
};

export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
