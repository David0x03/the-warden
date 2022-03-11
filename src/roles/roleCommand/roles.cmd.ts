import {
	ApplicationCommandType,
	ChatInputCommandInteraction,
	Colors
} from 'discord.js';
import { Command, Utils } from 'griz.js';
import { categoryButtons } from './rolesUtils';

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'roles',
			description: 'Change your roles'
		});
	}

	override async run(utils: Utils, interaction: ChatInputCommandInteraction) {
		utils.msg.send(interaction, {
			description: '🔖 **Which Role do you want to change?**',
			color: Colors.Blue,
			ephemeral: true,
			components: categoryButtons
		});
	}
}
