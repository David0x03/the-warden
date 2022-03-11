import { ButtonInteraction, GuildMember } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import roleOptions from '../roles.json';
import { getButtons, selectRole } from './rolesUtils';

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
			customId: /roles-(gender|sexuality|pronouns|location|dm|role)(-\d+)?$/
		});
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const [_, type, id] = interaction.customId.split('-');
		const user = (interaction.member as GuildMember).guild.me!;
		const userRoles = Array.from(user.roles.cache.keys());

		const assignArgs = {
			utils,
			interaction,
			user,
			userRoles,
			id
		};

		switch (type) {
			case 'gender':
				return this.changeGender(assignArgs);
			case 'sexuality':
				return this.changeSexuality(assignArgs);
			case 'pronouns':
				return this.changePronouns(assignArgs);
			case 'location':
				return this.changeLocation(assignArgs);
			case 'dm':
				return this.changeDMSettings(assignArgs);
			case 'role':
				return this.changeRole(assignArgs);
		}
	}

	private async changeGender(assignArgs: AssignArgs) {
		const message =
			'🐲 **Select your Gender**\n\n' + 'ℹ️ Your selected roles are green';

		this.changeRoleAndRespond(
			assignArgs,
			roleOptions.genders,
			'gender',
			message
		);
	}

	private async changeSexuality(assignArgs: AssignArgs) {
		const message =
			'✨ **Select your Sexuality**\n\n' + 'ℹ️ Your selected roles are green';

		this.changeRoleAndRespond(
			assignArgs,
			roleOptions.sexualities,
			'sexuality',
			message
		);
	}

	private async changePronouns(assignArgs: AssignArgs) {
		const message =
			'💬 **Select your Pronouns**\n\n' + 'ℹ️ Your selected roles are green';

		this.changeRoleAndRespond(
			assignArgs,
			roleOptions.pronouns,
			'pronouns',
			message
		);
	}

	private async changeLocation(assignArgs: AssignArgs) {
		const message =
			'🌍 **Select your Location**\n\n' + 'ℹ️ Your selected role is green';

		this.changeRoleAndRespond(
			assignArgs,
			roleOptions.locations,
			'location',
			message
		);
	}

	private async changeDMSettings(assignArgs: AssignArgs) {
		const message =
			'📩 **Select your DM preference**\n\n' + 'ℹ️ Your selected role is green';

		this.changeRoleAndRespond(
			assignArgs,
			roleOptions.dmSettings,
			'dm',
			message
		);
	}

	private async changeRole(assignArgs: AssignArgs) {
		const message =
			'🔑 **Select the Roles that describe your interests best**\n\n' +
			'ℹ️ Your selected role is green';

		this.changeRoleAndRespond(assignArgs, roleOptions.roles, 'role', message);
	}

	private async changeRoleAndRespond(
		assignArgs: AssignArgs,
		roles: Roles,
		type: string,
		message: string
	) {
		let { utils, interaction, user, userRoles, id } = assignArgs;

		if (id) userRoles = await selectRole(user, roles, userRoles, id);
		const buttons = await getButtons(utils, roles, userRoles, type);

		utils.msg.update(interaction, {
			description: message,
			components: buttons
		});
	}
}
