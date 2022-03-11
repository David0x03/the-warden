import { Events, ThreadChannel } from 'discord.js';
import { Event, Utils } from 'griz.js';

export default class extends Event {
	constructor() {
		super({ event: Events.ThreadUpdate });
	}

	override async run(
		utils: Utils,
		oldThread: ThreadChannel,
		newThread: ThreadChannel
	) {
		const raChannel = await utils.getChannel('roleAssignment');
		if (!raChannel) return;

		if (oldThread.parentId !== raChannel.id) return;
		if (oldThread.archived || !newThread.archived) return;

		newThread.delete();
	}
}
