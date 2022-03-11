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
	type: string
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
			customId: `roles-${type}-${role.id}`,
			style,
			disabled:
				required &&
				intersection(userRoles, roles).length === 1 &&
				userRoles.includes(role.id)
		});
	}

	buttons.push({
		label: 'Change another role',
		customId: 'roles-restart'
	});

	return chunk(buttons, 5);
}

export const categoryButtons = [
	[
		{
			label: 'Gender',
			customId: 'roles-gender',
			style: ButtonStyle.Secondary
		},
		{
			label: 'Sexuality',
			customId: 'roles-sexuality',
			style: ButtonStyle.Secondary
		},
		{
			label: 'Pronouns',
			customId: 'roles-pronouns',
			style: ButtonStyle.Secondary
		},
		{
			label: 'Location',
			customId: 'roles-location',
			style: ButtonStyle.Secondary
		}
	],
	[
		{
			label: 'DM Settings',
			customId: 'roles-dm',
			style: ButtonStyle.Secondary
		},
		{
			label: 'Roles',
			customId: 'roles-role',
			style: ButtonStyle.Secondary
		},
		{
			label: 'Other',
			customId: 'roles-other',
			style: ButtonStyle.Secondary
		}
	]
];
