import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction
} from 'discord.js';
import { Command, Utils } from 'griz.js';
import { sendModLog, UserArgs } from './sendModLog';

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'mod-log',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'User to check',
					required: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ user }: { user: UserArgs }
	) {
		sendModLog(utils, interaction, user, false);
	}
}
