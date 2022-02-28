import { ButtonStyle, Colors, Events, Invite } from 'discord.js';
import { Event, Utils } from 'griz.js';
import { updateInviteStats } from './inviteUtils';

export default class extends Event {
	constructor() {
		super({ event: Events.InviteCreate });
	}

	override async run(utils: Utils, invite: Invite) {
		const member = (await utils.getMember(invite.inviter!))!;
		updateInviteStats(utils.guild!);

		const msg = await utils.msg.send('joinLeftLog', {
			content: `${member!.displayName} created an invite`
		});
		if (!msg) return;

		utils.msg.edit(msg, {
			author: {
				name: `${member.displayName} created an invite`,
				icon: member
			},
			description: `${member} | ${invite.channel}`,
			color: Colors.Blue,
			footer: `${member.id} | ${member.user.tag} | ${invite.code}`,
			components: [
				{
					style: ButtonStyle.Danger,
					label: 'Revoke Invite',
					customId: `revoke-invite-${invite.code}`
				}
			]
		});
	}
}
