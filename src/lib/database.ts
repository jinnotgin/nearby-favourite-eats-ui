import { writable } from 'svelte/store';
import { browser } from '$app/env';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { app } from './firebase';

export interface UserInfo {
	usernameBurpple: string | null;
	known: boolean;
}

const dbStore = writable({ usernameBurpple: null, known: false });

export const getDb = () => {
	const { subscribe, set } = dbStore;

	let db;
	if (browser) {
		db = getFirestore(app);
	}

	const USERS = 'users';

	const setUserInfo = async (uid, fields) => {
		try {
			fields.lastLoggedIn = new Date();
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
			console.log(`Document data for ${uid}:`, fields);

			const { usernameBurpple } = fields;
			set({ usernameBurpple, known: true });

			// update last logged in timing
			await setDoc(doc(db, USERS, uid), { ...fields, lastLoggedIn: new Date() });
			return fields;
		} else {
			// doc.data() will be undefined in this case
			console.log(`No document for ${uid}`);
			set({ usernameBurpple: '', known: true });
			return false;
		}
	};

	const deleteUserInfo = async (uid) => {
		try {
			await deleteDoc(doc(db, USERS, uid));

			set({ usernameBurpple: null, known: false });
			return true;
		} catch (e) {
			console.error('Error deleting document: ', e);
			return false;
		}
	};

	return {
		subscribe,
		setUserInfo,
		getUserInfo,
		deleteUserInfo
	};
};

export const db = getDb();
export const _db = db;
