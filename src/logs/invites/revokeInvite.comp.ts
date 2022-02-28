import { ButtonInteraction, ButtonStyle } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /revoke-invite-.+/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const code = interaction.customId.split('-')[2];
		utils.guild!.invites.delete(code).catch(() => undefined);

		return utils.msg.update(interaction, {
			components: [
				{
					label: 'Invite revoked',
					style: ButtonStyle.Success,
					disabled: true
				}
			]
		});
	}
}
