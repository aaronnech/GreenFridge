var workerAPI: any = self;
if (workerAPI) {
	var worker = null;

	// Connection to worker API
	workerAPI.addEventListener('message', function(e) {
		if (worker == null) {
			worker = new ProductDataWorker();
		}
		worker.onMessage(e.data);
	}, false);
}

var Papa = require('../../vendor/papa');

class ProductDataWorker {
	private data : any;

	constructor() { }

	public onMessage(message: any) {
		console.log(message);
		switch (message.command) {
			case 'LOAD':
				Papa.parse(message.url, {
					download: true,
					complete: (function(results) {
						this.data = results.data;
						workerAPI.postMessage({ command: 'LOADED' });
					}).bind(this)
				});
				break;

			case 'PRODUCT':
				if (!this.data) {
					workerAPI.postMessage({ command: 'PRODUCT', payload: null });
				} else {
					var load = null;
					for (var i = 0; i < this.data.length; i++) {
						if (this.data[i][2] == message.code) {
							load = this.data[i];
							break;
						}
					}

					workerAPI.postMessage({ command: 'PRODUCT', payload: load });
				}
				break;
		}
	}
}

export = ProductDataWorker;