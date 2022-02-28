import { Colors, Events } from 'discord.js';
import { Event, Utils } from 'griz.js';

export default class extends Event {
	constructor() {
		super({ event: Events.Error });
	}

	override async run(utils: Utils, error: Error) {
		utils.msg.send('log', {
			title: error.name,
			description: `\`\`\`${error.stack}\`\`\``,
			color: Colors.Red
		});
	}
}
