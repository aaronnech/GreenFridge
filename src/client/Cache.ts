class Cache {
	public static getCacheV(key : string): string {
		return window.localStorage.getItem(key);
	}

	public static setCacheKV(key : string, val : string) {
		window.localStorage.setItem(key, val);
	}

	public static clear() {
		window.localStorage.clear();
	}
}

export = Cache;