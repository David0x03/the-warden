import { Colors, Events, GuildMember } from 'discord.js';
import { Event, Utils } from 'griz.js';
import { humanDuration, ts } from '../../utils';
import { getLastUsedInvite } from '../invites/inviteUtils';

export default class extends Event {
	constructor() {
		super({ event: Events.GuildMemberAdd });
	}

	override async run(utils: Utils, member: GuildMember) {
		if (member.user.bot) return;

		const msg = await utils.msg.send('joinLeftLog', {
			content: `${member.displayName} joined`
		});
		if (!msg) return;

		const invite = await getLastUsedInvite(utils.guild!);
		const inviter =
			(await utils.getMember(invite?.inviterId ?? '-')) ?? invite?.inviterId;

		let inviterText = '';
		if (!inviter) inviterText = 'Inviter not found';
		else if (typeof inviter === 'string') inviterText = inviter;
		else if ('displayName' in inviter)
			inviterText = `${inviter} (${inviter.displayName})`;

		const createdTs = member.user.createdTimestamp;

		utils.msg.edit(msg, {
			author: { name: `${member.displayName} joined`, icon: member },
			thumbnail: member,
			description:
				`👤 ${member}\n` +
				`🏷️ ${inviterText}\n\n` +
				`🕓 ${ts(createdTs)} (${humanDuration(createdTs)})`,
			footer: `${member.id} | ${member.user.tag} | ${invite?.code ?? '---'}`,
			color: Colors.Green
		});
	}
}
