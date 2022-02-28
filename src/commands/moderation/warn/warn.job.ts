import { Colors, CommandInteraction, GuildMember } from 'discord.js';
import { Job, Utils } from 'griz.js';
import { addModLogEntry, modCmdValidate } from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember;
	target: GuildMember | undefined;
	reason: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'warn' });
	}

	override async run(utils: Utils, { interaction, mod, target, reason }: Args) {
		if (!(await modCmdValidate(utils, interaction, mod, target))) return;
		if (!target) return;

		addModLogEntry(utils, 'Warn', mod, target, reason);

		// DM
		utils.msg.send(target, {
			title: `You have been warned on ${utils.guild!.name}`,
			thumbnail: utils.guild,
			description: `**Reason**\n${reason}`,
			color: Colors.Yellow
		});

		// Mod log
		utils.msg.send('modLog', {
			title: `${target.displayName} | Warn`,
			thumbnail: target,
			description: `👤 ${target} | 👮 ${mod}\n\n` + `**Reason**\n${reason}`,
			footer: target,
			color: Colors.Yellow
		});

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: { name: `Warned ${target.displayName}`, icon: target },
				description: `**Reason**\n${reason}`,
				color: Colors.Green
			});
	}
}
