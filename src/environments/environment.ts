// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	firebaseConfig: {
		apiKey: 'AIzaSyCNC0Rl6WPNd1qzTpyVchkyImJc1Fy4T54',
		authDomain: 'ranzcr-anatomy.firebaseapp.com',
		databaseURL: 'https://ranzcr-anatomy.firebaseio.com',
		projectId: 'ranzcr-anatomy',
		storageBucket: 'ranzcr-anatomy.appspot.com',
		messagingSenderId: '51391304946'
	}
};
