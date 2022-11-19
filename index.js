var InstanceSkel = require('../../instance_skel');

const configFields = require('./src/configFields');
const api = require('./src/api');
const actions = require('./src/actions');
const variables = require('./src/variables');
const feedbacks = require('./src/feedbacks');
const presets = require('./src/presets');

class GenericPingInstance extends InstanceSkel {
	constructor(system, id, config) {
		super(system, id, config)

		this.config = config

		this.INTERVAL = null;

		this.alive = '';
		this.min = '';
		this.max = '';
		this.avg = '';
		this.packetLoss = '';

		this.STOP_PING = false;

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configFields,
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,			
		})
	}

	init() {
		this.status(this.STATUS_UNKNOWN);

		// Update the config
		this.updateConfig();
	}

	updateConfig(config) {
		if (config) {
			this.config = config
		}

		// Quickly check if certain config values are present and continue setup
		if (this.config.host) {
			if (this.INTERVAL) {
				this.stopPing();
			}

			// Init the Actions
			this.actions();

			// Init and Update Variables
			this.updateVariableDefinitions();
			this.checkVariables();

			// Init the Feedbacks
			this.feedbacks();

			// Init the Presets
			this.presets();

			this.status(this.STATUS_UNKNOWN);

			this.startPing();
		}
	}

	destroy() {
		//close out any connections
		this.stopPing();

		this.debug('destroy', this.id);
	}
}

module.exports = GenericPingInstance;