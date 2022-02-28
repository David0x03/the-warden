import { Job, Utils } from 'griz.js';
import { updateInviteStats } from './inviteUtils';

export default class extends Job {
	constructor() {
		super({ onReady: true });
	}

	override async run(utils: Utils) {
		utils.client.guilds.cache.forEach(updateInviteStats);
	}
}
