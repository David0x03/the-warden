import { ButtonInteraction } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'ra-help' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		utils.msg.update(interaction, {});
		utils.msg.send(interaction.channel!, {
			content: `<@&929504220544110602>, ${interaction.member} needs your help in the role assignment`
		});
	}
}
