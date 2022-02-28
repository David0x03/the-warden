import { Colors, CommandInteraction, GuildMember } from 'discord.js';
import { Job, Utils } from 'griz.js';
import { addModLogEntry, modCmdValidate } from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember;
	target: GuildMember | undefined;
	note: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'note' });
	}

	override async run(utils: Utils, { interaction, mod, target, note }: Args) {
		if (!(await modCmdValidate(utils, interaction, mod, target))) return;
		if (!target) return;

		addModLogEntry(utils, 'Note', mod, target, note);

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: { name: `Note for ${target.displayName}`, icon: target },
				description: `**Note**\n${note}`,
				color: Colors.Green
			});
	}
}
