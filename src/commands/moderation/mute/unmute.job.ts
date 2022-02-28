import { Colors, CommandInteraction, GuildMember } from 'discord.js';
import { Job, Utils } from 'griz.js';
import { addModLogEntry, errorResponse, modCmdValidate } from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember | string | undefined;
	target: GuildMember | string | undefined;
	reason: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'unmute' });
	}

	override async run(utils: Utils, { interaction, mod, target, reason }: Args) {
		const roles = await utils.db.settings('roles');
		const { member: memberRole, mute: muteRole } = roles ?? {};
		if (!memberRole || !muteRole) return;

		if (typeof target === 'string') target = await utils.getMember(target);
		if (typeof mod === 'string') mod = await utils.getMember(mod);
		if (!mod) return;

		if (!(await modCmdValidate(utils, interaction, mod, target))) return;
		if (!target) return;

		if (!target.roles.cache.has(muteRole)) {
			if (interaction) errorResponse(interaction, 'This user not muted');
			return;
		}

		await target.roles.add(memberRole);
		await target.roles.remove(muteRole);

		utils.db.delete('jobs', { name: 'unmute', 'data.target': target.id });
		addModLogEntry(utils, 'Unmute', mod, target, reason);

		// DM
		utils.msg.send(target, {
			title: `You have been unmuted on ${utils.guild!.name}`,
			thumbnail: utils.guild,
			description: `**Reason**\n${reason}`,
			color: Colors.Green
		});

		// Mod log
		utils.msg.send('actionLog', {
			title: `${target.displayName} | Unmute`,
			thumbnail: target,
			description: `👤 ${target} | 👮 ${mod}\n\n` + `**Reason**\n${reason}`,
			footer: target,
			color: Colors.Green
		});

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: { name: `Unmuted ${target.displayName}`, icon: target },
				description: `**Reason**\n${reason}`,
				color: Colors.Green
			});
	}
}
