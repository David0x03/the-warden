import { Colors, CommandInteraction, GuildMember, User } from 'discord.js';
import { Job, Utils } from 'griz.js';
import { addModLogEntry, errorResponse, isMod } from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember;
	target: User;
	reason: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'unban' });
	}

	override async run(utils: Utils, { interaction, mod, target, reason }: Args) {
		if (!(await isMod(utils, mod))) {
			if (interaction)
				errorResponse(
					interaction,
					"Either you or the bot isn't privileged to perform this action"
				);
			return;
		}

		if (!(await this.isBanned(utils, target.id))) {
			if (interaction) errorResponse(interaction, 'This user is not banned');
			return;
		}

		await utils.guild!.members.unban(target, reason);
		addModLogEntry(utils, 'Unban', mod, target, reason);

		// Mod log
		utils.msg.send('modLog', {
			title: `${target.username} | Unban`,
			thumbnail: target,
			description: `👤 ${target} | 👮 ${mod}\n\n` + `**Reason**\n${reason}`,
			footer: target,
			color: Colors.Green
		});

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: { name: `Unbanned ${target.username}`, icon: target },
				description: `**Reason**\n${reason}`,
				color: Colors.Green
			});
	}

	private async isBanned(utils: Utils, id: string) {
		const isBanned = await utils
			.guild!.bans.fetch({ user: id, force: true })
			.catch(() => undefined);
		return isBanned ? true : false;
	}
}
