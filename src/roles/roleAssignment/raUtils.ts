import { ButtonStyle, GuildMember } from 'discord.js';
import { Utils } from 'griz.js';
import { chunk, intersection, pull } from 'lodash';

interface Roles {
	roles: string[];
	options: { required: boolean; multi: boolean };
}

export async function selectRole(
	user: GuildMember,
	{ roles, options }: Roles,
	userRoles: string[],
	id: string
) {
	if (options.multi) {
		if (!userRoles.includes(id)) userRoles.push(id);
		else pull(userRoles, id);
	} else {
		if (userRoles.includes(id)) pull(userRoles, id);
		else {
			pull(userRoles, ...roles);
			userRoles.push(id);
		}
	}

	await user.roles.set(userRoles);
	return userRoles;
}

export async function getButtons(
	utils: Utils,
	{ roles, options: { required } }: Roles,
	userRoles: string[],
	type: string,
	next: string
) {
	const buttons = [];

	for (const roleId of roles) {
		const role = await utils.getRole(roleId);
		if (!role) continue;

		const style = userRoles.includes(role.id)
			? ButtonStyle.Success
			: ButtonStyle.Secondary;

		buttons.push({
			label: role.name,
			customId: `ra-${type}-${role.id}`,
			style
		});
	}

	buttons.push({
		label: required || intersection(userRoles, roles).length ? 'Next' : 'Skip',
		customId: `ra-${next}`,
		disabled: required && !intersection(userRoles, roles).length
	});

	return chunk(buttons, 5);
}
