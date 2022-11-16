module.exports = {
	updateVariableDefinitions() {
		let variables = [
			{ label: 'Host', name: 'host'},
			{ label: 'Alive State', name: 'alive'},
			{ label: 'Response Time (Min)', name: 'response_time_min'},
			{ label: 'Response Time (Max)', name: 'response_time_max'},
			{ label: 'Response Time (Avg)', name: 'response_time_avg'},
			{ label: 'Packet Loss %', name: 'packet_loss'},
		]

		this.setVariableDefinitions(variables);
	},

	checkVariables() {
		try {
			this.setVariable('host', this.config.host);
			this.setVariable('alive', (this.alive ? 'True' : 'False'));
			this.setVariable('response_time_min', this.min);
			this.setVariable('response_time_max', this.max);
			this.setVariable('response_time_avg', this.avg);
			this.setVariable('packet_loss', this.packetLoss);
		}
		catch(error) {
			//do something with that error
			if (this.config.verbose) {
				this.log('debug', 'Error Updating Variables: ' + error);
			}
		}
	}
}