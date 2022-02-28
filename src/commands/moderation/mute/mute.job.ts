import { Colors, CommandInteraction, GuildMember } from 'discord.js';
import { Job, Utils } from 'griz.js';
import {
	addModLogEntry,
	errorResponse,
	humanDuration,
	modCmdValidate
} from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember;
	target: GuildMember | undefined;
	duration: number;
	reason: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'mute' });
	}

	override async run(
		utils: Utils,
		{ interaction, mod, target, duration, reason }: Args
	) {
		const roles = await utils.db.settings('roles');
		const { member: memberRole, mute: muteRole } = roles ?? {};
		if (!memberRole || !muteRole) return;

		if (!(await modCmdValidate(utils, interaction, mod, target))) return;
		if (!target) return;

		if (target.roles.cache.has(muteRole)) {
			if (interaction) errorResponse(interaction, 'This user is already muted');
			return;
		}

		await target.roles.add(muteRole);
		await target.roles.remove(memberRole);

		const mutedUntil = Date.now() + duration;
		const durationText = humanDuration(mutedUntil);

		if (duration)
			utils.job.schedule('unmute', mutedUntil, {
				target: target.id,
				mod: utils.client.user!.id,
				reason: 'Mute Expired'
			});

		addModLogEntry(utils, 'Mute', mod, target, reason);

		// DM
		utils.msg.send(target, {
			title:
				`You have been muted on ${utils.guild!.name}` +
				(duration ? ` for ${durationText}` : ''),
			thumbnail: utils.guild,
			description: `**Reason**\n${reason}`,
			color: Colors.Orange
		});

		// Mod log
		utils.msg.send('modLog', {
			title:
				`${target!.displayName} | Mute` + (duration ? ` ${durationText}` : ''),
			thumbnail: target,
			description: `👤 ${target} | 👮 ${mod}\n\n` + `**Reason**\n${reason}`,
			footer: target,
			color: Colors.Orange
		});

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: {
					name:
						`Muted ${target.displayName}` +
						(duration ? ` for ${durationText}` : ''),
					icon: target
				},
				description: `**Reason**\n${reason}`,
				color: Colors.Green
			});
	}
}
