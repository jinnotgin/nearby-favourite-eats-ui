import { writable } from 'svelte/store';
import { browser } from '$app/env';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './firebase';

export interface UserInfo {
	usernameBurpple: string | null;
	known: boolean;
}

const dbStore = writable<AuthState>({ user: null, known: false });

export const getDb = () => {
	const { subscribe, set } = dbStore;

	let db;
	if (browser) {
		db = getFirestore(app);
	}

	const USERS = 'users';

	const setUserInfo = async (uid, fields) => {
		try {
			await setDoc(doc(db, USERS, uid), fields);

			const { usernameBurpple } = fields;
			set({ usernameBurpple, known: true });
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
			const fields = docSnap.data();
			console.log('Document data:', fields);

			const { usernameBurpple } = fields;
			set({ usernameBurpple, known: true });
			return fields;
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
			return false;
		}
	};

	return {
		subscribe,
		setUserInfo,
		getUserInfo
	};
};

export const db = getDb();
export const _db = db;
