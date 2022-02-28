import { CommandInteraction, GuildMember, User } from 'discord.js';
import { Utils } from 'griz.js';
import { errorResponse } from './msgUtils';

export async function modCmdValidate(
	utils: Utils,
	interaction: CommandInteraction | undefined,
	mod: GuildMember,
	target: GuildMember | undefined
) {
	if (!target) {
		if (interaction)
			errorResponse(interaction, 'The user must be a member on this server');
		return;
	}

	if (!(await canModerate(utils, mod, target))) {
		if (interaction)
			errorResponse(
				interaction,
				"Either you or the bot isn't privileged to perform this action"
			);
		return;
	}

	return true;
}

export async function addModLogEntry(
	utils: Utils,
	action: string,
	mod: GuildMember,
	target: GuildMember | User,
	reason: string
) {
	return utils.db.updateUser(target.id, {
		$push: {
			modLog: { action, target: target.id, mod: mod.id, reason, ts: new Date() }
		}
	});
}

export async function canModerate(
	utils: Utils,
	mod: GuildMember,
	target: GuildMember
) {
	const targetIsMod = await isMod(utils, target);
	const modIsMod = await isMod(utils, mod);

	return target.moderatable && !targetIsMod && modIsMod;
}

export async function isMod(utils: Utils, member: GuildMember) {
	if (member.id === utils.client.user?.id) return true;
	const modRoles = (await utils.db.settings('roles.mods')) ?? [];
	return member.roles.cache.hasAny(...modRoles);
}
