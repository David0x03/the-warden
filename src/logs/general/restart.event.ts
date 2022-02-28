import { Colors, Events } from 'discord.js';
import { Event, Utils } from 'griz.js';

export default class extends Event {
	constructor() {
		super({ event: Events.ClientReady });
	}

	override async run(utils: Utils) {
		utils.msg.send('log', {
			author: {
				name: `${utils.client.user?.username} restarted!`,
				icon: utils.client.user
			},
			color: Colors.Green
		});
	}
}
