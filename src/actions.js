module.exports = {

	actions() {
		let self = this; // required to have reference to outer `this`
		let actionsArr = {};

		actionsArr.startPing = {
			label: 'Start Ping',
			callback: function(action, bank) {
				self.startPing();
			}
		};

		actionsArr.stopPing = {
			label: 'Stop Ping',
			callback: function(action, bank) {
				self.stopPing();
			}
		};

		this.setActions(actionsArr);
	},
}
