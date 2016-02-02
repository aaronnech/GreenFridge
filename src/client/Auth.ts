/// <reference path="../common/def/firebase.d.ts"/>
/// <reference path="../common/def/node.d.ts"/>

import Firebase = require("firebase");
import Cache = require('./Cache');
import Constants = require('./Constants');

/**
 * Static application API for Authentication
 */
class Auth {
	public static FIRE = new Firebase(Constants.FIREBASE_URL);
	
	public static isAuth(): boolean {
		var uid = Cache.getCacheV(Constants.AUTH.UID);
		if (uid) {
			Constants.fireAccess = Constants.FIRE_USER + uid + '/';
			return !!Auth.FIRE.getAuth();
		} else {
			return false;
		}
	}

	public static deAuth(): void {
		Cache.clear();
	}
	
	public static authFacebook(cb: Function): void {
		Auth.FIRE.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				cb(false);
			} else {
				Cache.setCacheKV(Constants.AUTH.TOKEN, (<any> authData).facebook.accessToken);
				Cache.setCacheKV(Constants.AUTH.UID, (<any> authData).uid);
				Cache.setCacheKV(Constants.AUTH.FULL_NAME, (<any> authData).facebook.displayName);

				Constants.fireAccess = Constants.FIRE_USER + (<any> authData).uid + '/';

				// Create firebase record if one does not exist (e.g. new user)
				var ref = new Firebase(Constants.fireAccess);
				ref.once("value", function(snapshot) {
					var exists = (snapshot.val() !== null);

					if (!exists) {
						Auth.FIRE.child("users").child((<any>authData).uid).set({
							name: (<any>authData).facebook.displayName
						}, function(error) {
							cb(!error);
						});
					} else {
						cb(true);
					}
				});
			}
		});
	}
}

export = Auth;