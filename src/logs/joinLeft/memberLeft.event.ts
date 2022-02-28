import { Colors, Events, GuildMember } from 'discord.js';
import { Event, Utils } from 'griz.js';
import { humanDuration } from '../../utils';

export default class extends Event {
	constructor() {
		super({ event: Events.GuildMemberRemove });
	}

	override async run(utils: Utils, member: GuildMember) {
		const msg = await utils.msg.send('joinLeftLog', {
			content: `${member.displayName} left`
		});
		if (!msg) return;

		const joinedTs = member.joinedTimestamp ?? 0;
		const roles = member.roles.cache.sort(
			(r1, r2) => r2.position - r1.position
		);

		utils.msg.edit(msg, {
			author: { name: `${member.displayName} left`, icon: member },
			thumbnail: member,
			description:
				`👤 ${member} | 🕓 ${humanDuration(joinedTs)}\n\n` +
				`🔖 **Roles**\n${Array.from(roles.values()).join(' ')}`,
			color: Colors.Red,
			footer: member
		});
	}
}
