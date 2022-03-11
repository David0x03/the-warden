import { ButtonInteraction, Message } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'agenda-cancel' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		(interaction.message as Message).delete();
	}
}
