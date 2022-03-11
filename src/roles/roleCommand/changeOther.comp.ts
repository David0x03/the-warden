import { ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { consideringSubs, locked, seekingDominant } from '../roles.json';
import { selectRole } from './rolesUtils';

const groups = [locked, seekingDominant, consideringSubs];

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /roles-other(-\d+)?$/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const id = interaction.customId.split('-')[2];
		const user = interaction.member as GuildMember;
		let userRoles = Array.from(user.roles.cache.keys());

		if (id) {
			const group = groups.find((g) => g.roles.includes(id))!;
			userRoles = await selectRole(user, group, userRoles, id);
		}

		const buttons = await this.getButtons(utils, userRoles);

		utils.msg.update(interaction, {
			description:
				'🔒 **Other Roles**\n\n' +
				'These are roles to show if you are currently:\n\n' +
				`🔸**Locked / Unlocked** (<@&${locked.roles[0]}> / <@&${locked.roles[1]}>),\n` +
				'🔸**Seeking a dominant partner,**\n' +
				'🔸**Or are considering new subs.**\n\n' +
				'ℹ️ Your selected roles are green',
			components: buttons
		});
	}

	private async getButtons(utils: Utils, userRoles: string[]) {
		const buttons = [];

		for (const group of groups) {
			const buttonGroup = [];
			for (const roleId of group.roles) {
				const role = await utils.getRole(roleId);
				if (!role) continue;

				const style = userRoles.includes(role.id)
					? ButtonStyle.Success
					: ButtonStyle.Secondary;

				buttonGroup.push({
					label: role.name,
					customId: `roles-other-${role.id}`,
					style
				});
			}
			buttons.push(buttonGroup);
		}

		buttons.push([{ label: 'Change another role', customId: 'roles-restart' }]);

		return buttons;
	}
}
