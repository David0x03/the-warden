import { ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import roleOptions from '../roles.json';
import { getButtons, selectRole } from './raUtils';

interface AssignArgs {
	utils: Utils;
	interaction: ButtonInteraction;
	user: GuildMember;
	userRoles: string[];
	id?: string;
}

interface Roles {
	roles: string[];
	options: { required: boolean; multi: boolean };
}

export default class extends ComponentEvent {
	constructor() {
		super({
			customId: /ra-(gender|sexuality|pronouns|location|dm|role)(-\d+)?$/
		});
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const [_, type, id] = interaction.customId.split('-');
		const user = interaction.member as GuildMember;
		const userRoles = Array.from(user.roles.cache.keys());

		const assignArgs = { utils, interaction, user, userRoles, id };

		switch (type) {
			case 'gender':
				return this.assignGender(assignArgs);
			case 'sexuality':
				return this.assignSexuality(assignArgs);
			case 'pronouns':
				return this.assignPronouns(assignArgs);
			case 'location':
				return this.assignLocation(assignArgs);
			case 'dm':
				return this.assignDMSettings(assignArgs);
			case 'role':
				return this.assignRole(assignArgs);
		}
	}

	private async assignGender(assignArgs: AssignArgs) {
		let { utils, interaction, user, userRoles, id } = assignArgs;
		const roles = roleOptions.genders;

		if (id) userRoles = await selectRole(user, roles, userRoles, id);
		else
			utils.msg.update(interaction, {
				components: [
					{
						label: 'I need Help',
						customId: 'ra-help',
						style: ButtonStyle.Danger
					}
				]
			});

		const buttons = await getButtons(
			utils,
			roles,
			userRoles,
			'gender',
			'sexuality'
		);

		const message = {
			description:
				'🐲 **Select your Gender (1/7)**\n\n' +
				'ℹ️ You can skip this selection or select multiple roles.',
			components: buttons
		};

		if (id) utils.msg.update(interaction, message);
		else utils.msg.send(interaction.channel!, message);
	}

	private async assignSexuality(assignArgs: AssignArgs) {
		const message =
			'✨ **Select your Sexuality (2/7)**\n\n' +
			'ℹ️ You can skip this selection or select multiple roles.';

		this.selectRoleAndRespond(
			assignArgs,
			roleOptions.sexualities,
			'sexuality',
			'pronouns',
			message
		);
	}

	private async assignPronouns(assignArgs: AssignArgs) {
		const message =
			'💬 **Select your Pronouns (3/7)**\n\n' +
			'ℹ️ You can select multiple roles.';

		this.selectRoleAndRespond(
			assignArgs,
			roleOptions.pronouns,
			'pronouns',
			'location',
			message
		);
	}

	private async assignLocation(assignArgs: AssignArgs) {
		const message =
			'🌍 **Select your Location (4/7)**\n\n' +
			'ℹ️ You can skip this selection.';

		this.selectRoleAndRespond(
			assignArgs,
			roleOptions.locations,
			'location',
			'dm',
			message
		);
	}

	private async assignDMSettings(assignArgs: AssignArgs) {
		const message = '📩 **Select your DM preference (5/7)**';

		this.selectRoleAndRespond(
			assignArgs,
			roleOptions.dmSettings,
			'dm',
			'role',
			message
		);
	}

	private async assignRole(assignArgs: AssignArgs) {
		const message =
			'🔑 **Select the Roles that describe your interests best (6/7)**\n\n' +
			'ℹ️ You can change your roles at any time if your interests evolve.\n' +
			'Skip this selection or select multiple roles.';

		this.selectRoleAndRespond(
			assignArgs,
			roleOptions.roles,
			'role',
			'other',
			message
		);
	}

	private async selectRoleAndRespond(
		assignArgs: AssignArgs,
		roles: Roles,
		type: string,
		next: string,
		message: string
	) {
		let { utils, interaction, user, userRoles, id } = assignArgs;

		if (id) userRoles = await selectRole(user, roles, userRoles, id);

		const buttons = await getButtons(utils, roles, userRoles, type, next);

		utils.msg.update(interaction, {
			description: message,
			components: buttons
		});
	}
}
