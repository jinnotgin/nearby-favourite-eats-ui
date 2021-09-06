import { browser } from '$app/env';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './firebase';

export const createDb = () => {
	if (browser) {
		const db = getFirestore(app);
		const USERS = 'users';

		const setUserInfo = async (uid, fields) => {
			try {
				await setDoc(doc(db, USERS, uid), fields);
				return true;
			} catch (e) {
				console.error('Error adding document: ', e);
				return false;
			}
		};

		const getUserInfo = async (uid) => {
			const docRef = doc(db, USERS, uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data());
				return docSnap.data();
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!');
				return false;
			}
		};

		return {
			setUserInfo,
			getUserInfo
		};
	} else {
		return null;
	}
};
