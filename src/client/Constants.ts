class Constants {
	public static SCREENS: any = {
        FACEBOOK: 1,
		HOME: 2,
		ADD_PRODUCT: 3,
		DELETE_PRODUCT: 4,
		EDIT_PRODUCT: 5,
		WASTED: 6,
    };

	public static CATEGORIES: string[] = [
		'Fruit',
		'Veggies',
		'Condiments / Dressings',
		'Meat',
		'Bread/Grains',
		'Nuts/Legumes',
		'Dairy',
		'Desserts',
		'Leftovers',
		'Other'
	];
	
	public static AUTH: any = {
		TOKEN: 'accessToken',
		UID: 'userID',
		FULL_NAME: "userFullName"
	};
	
	public static FIREBASE_URL: string = "https://greenfridge.firebaseio.com/";
	public static FIRE_USER: string = Constants.FIREBASE_URL + 'users/';
	public static fireAccess: string = '';
}

export = Constants;