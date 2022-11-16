const ping = require('ping');

module.exports = {
	startPing() {
		let self = this; // required to have reference to outer `this`
		
		const host = self.config.host;
		const timeout = self.config.timeout;

		const retryrate = self.config.retryrate;

		if (retryrate > 0) {
			self.INTERVAL = setInterval(sendPing.bind(self), retryrate, host, timeout);
		}
		else {
			self.log('info', 'Retry Rate is 0. Module will send one ping, and then stop.');
			sendPing(host, timeout);
		}
	},

	stopPing() {
		let self = this; // required to have reference to outer `this`
		self.log('info', 'Stopping Ping.');
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
}

async function sendPing(host, timeout) {
	let self = this;

	try {
		if (self.config.verbose) {
			self.log('debug', 'Sending Ping to ' + host);
		}

		let res = await ping.promise.probe(host, {
			timeout: timeout
		});
		
		self.alive = res.alive;

		if (self.config.verbose) {
			self.log('debug', 'Ping Output: ' + res.output);
		}		

		self.min = res.min;
		self.max = res.max;
		self.avg = res.avg;
		self.packetLoss = res.packetLoss;

		if (res.alive == true) {
			this.status(this.STATUS_OK);
		}
		else if (res.alive == false) {
			this.status(this.STATUS_ERROR);
			this.log('error', 'Host is not alive.');
		}
		else {
			this.status(this.STATUS_UNKNOWN);
		}

		self.checkFeedbacks();
		self.checkVariables();
	}
	catch(error) {
		self.log('error', 'Error pinging: ' + error);
	}

}