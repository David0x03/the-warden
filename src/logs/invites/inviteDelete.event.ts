import { Events, Invite } from 'discord.js';
import { Event, Utils } from 'griz.js';
import { updateLastInvite } from './inviteUtils';

export default class extends Event {
	constructor() {
		super({ event: Events.InviteDelete });
	}

	override async run(utils: Utils, invite: Invite) {
		updateLastInvite(invite);
	}
}
