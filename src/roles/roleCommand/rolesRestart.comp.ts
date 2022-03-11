import { ButtonInteraction } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { categoryButtons } from './rolesUtils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'roles-restart' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		utils.msg.update(interaction, {
			description: '🔖 **Which Role do you want to change?**',
			components: categoryButtons
		});
	}
}
