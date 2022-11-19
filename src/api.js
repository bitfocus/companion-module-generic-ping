const ping = require('ping');

module.exports = {
	startPing() {		
		const host = this.config.host;
		const timeout = this.config.timeout;

		const retryrate = this.config.retryrate;
		
		if (this.PING_INTERVAL == null) {
			sendPing.bind(this)(host, timeout, retryrate);
		}		
	},

	stopPing() {
		this.log('info', 'Stopping Ping.');
		clearInterval(this.PING_INTERVAL);
		this.PING_INTERVAL = null;
		this.STOP_PING = true;		
	}
}

async function sendPing(host, timeout, retryrate) {
	try {
		if (this.config.verbose) {
			this.log('debug', 'Sending Ping to ' + host);
		}

		if (retryrate == 0) {
			this.log('info', 'Retry Rate is 0. Module will send one ping, and then stop.');
		}

		let res = await ping.promise.probe(host, {
			timeout: timeout
		});
		
		this.alive = res.alive;

		if (this.config.verbose) {
			//this.log('debug', 'Ping Output: ' + res.output);
		}		

		this.min = res.min;
		this.max = res.max;
		this.avg = res.avg;
		this.packetLoss = res.packetLoss;
		this.lastping = new Date();

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

		this.checkFeedbacks();
		this.checkVariables();

		if (this.STOP_PING || retryrate == 0) {
			clearInterval(this.PING_INTERVAL);
			this.PING_INTERVAL = null;
		}
		else if (retryrate > 0) {
			this.PING_INTERVAL = setTimeout(sendPing.bind(this), retryrate, host, timeout, retryrate);
		}		
	}
	catch(error) {
		this.log('error', 'Error pinging: ' + error);
	}
}