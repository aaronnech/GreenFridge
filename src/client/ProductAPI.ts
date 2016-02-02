// Product API Singleton
class ProductAPI {
	private static CSV_FILE: string = "/data/Grocery_UPC_Database.csv";
	private worker: any;
	private cbQueue: any[];

	constructor() {
		this.worker = new Worker('js/worker/w.data.js');
		this.worker.onmessage = (e) => {
			if (this.cbQueue.length > 0) {
				this.cbQueue.shift()(e);
			}
		};
		this.cbQueue = [];
	}

	private send(message, cb) {
		this.cbQueue.push(cb);
		this.worker.postMessage(message);
	}

	public load(cb) {
		this.send({ command: 'LOAD', url: ProductAPI.CSV_FILE }, (e) => {
			cb();
		});
	}

	public lookup(code, cb) {
		this.send({ command: 'PRODUCT', code: code }, (e) => {
			cb(e.data.payload);
		});
	}
}

export = (new ProductAPI());