import { Colors, CommandInteraction, GuildMember, User } from 'discord.js';
import { Job, Utils } from 'griz.js';
import {
	addModLogEntry,
	errorResponse,
	isMod,
	modCmdValidate
} from '../../../utils';

interface Args {
	interaction?: CommandInteraction;
	mod: GuildMember;
	target: GuildMember | User;
	reason: string;
}

export default class extends Job {
	constructor() {
		super({ name: 'ban' });
	}

	override async run(utils: Utils, { interaction, mod, target, reason }: Args) {
		if (target instanceof GuildMember) {
			if (!(await modCmdValidate(utils, interaction, mod, target))) return;
		} else if (target instanceof User) {
			if (!(await isMod(utils, mod))) {
				if (interaction)
					errorResponse(
						interaction,
						"Either you or the bot isn't privileged to perform this action"
					);
				return;
			}
		}

		if (await this.isBanned(utils, target.id)) {
			if (interaction)
				errorResponse(interaction, 'This user is already banned');
			return;
		}

		addModLogEntry(utils, 'Ban', mod, target, reason);

		// DM
		utils.msg.send(target, {
			title: `You have been banned from ${utils.guild!.name}`,
			thumbnail: utils.guild,
			description: `**Reason**\n${reason}`,
			color: Colors.Red
		});

		let targetName = '';
		if (target instanceof GuildMember) targetName = target.displayName;
		else targetName = target.username;

		// Mod log
		utils.msg.send('modLog', {
			title: `${targetName} | Ban`,
			thumbnail: target,
			description: `👤 ${target} | 👮 ${mod}\n\n` + `**Reason**\n${reason}`,
			footer: target,
			color: Colors.Red
		});

		await utils.guild!.members.ban(target, {
			deleteMessageDays: 7,
			reason
		});

		// Response
		if (interaction)
			utils.msg.send(interaction, {
				author: { name: `Banned ${targetName}`, icon: target },
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
