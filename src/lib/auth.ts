// Adapted from https://github.com/CaptainCodeman/sveltekit-example/blob/master/src/lib/auth.ts

import { writable } from 'svelte/store';
import { browser } from '$app/env';
import {
	getAuth,
	onAuthStateChanged as _onAuthStateChanged,
	signInWithRedirect,
	signOut as _signOut,
	GoogleAuthProvider,
	signInAnonymously as _signInAnonymously,
	deleteUser as _deleteUser
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { app } from './firebase';

export interface AuthState {
	user: User | null;
	known: boolean;
}

const authStore = writable<AuthState>({ user: null, known: false });

export const createAuth = () => {
	// const { subscribe, set } = writable<AuthState>({ user: null, known: false });
	const { subscribe, set } = authStore;

	let auth;
	if (browser) {
		auth = getAuth(app);
		console.log(auth);
	}

	async function listen() {
		_onAuthStateChanged(
			auth,
			(user) => set({ user, known: true }),
			(err) => console.error(err.message)
		);
	}

	function providerFor(name: string) {
		switch (name) {
			case 'google':
				return new GoogleAuthProvider();
			default:
				throw 'unknown provider ' + name;
		}
	}

	async function signInWith(name: string) {
		const provider = providerFor(name);
		console.log(auth, provider);
		await signInWithRedirect(auth, provider);
	}

	async function signInAnonymously() {
		set({ user: null, known: false });
		await _signInAnonymously(auth);
	}

	async function signOut() {
		await _signOut(auth);
	}

	async function deleteUser() {
		console.log('Deleting user...');
		set({ user: null, known: false });
		await _deleteUser(auth.currentUser);
	}

	async function onAuthStateChanged(success = () => {}) {
		_onAuthStateChanged(
			auth,
			(user) => success(user),
			(err) => console.error(err.message)
		);
	}

	if (browser) {
		// listen to auth changes on client
		listen();
	} else {
		// no auth on server in this example
		set({ user: null, known: false });
	}

	return {
		subscribe,
		signInAnonymously,
		signInWith,
		signOut,
		onAuthStateChanged,
		deleteUser
	};
};

export const auth = createAuth();
