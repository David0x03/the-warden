import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	User
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	target: { user: User };
	reason: string;
}

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'unban',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to unban',
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'reason',
					description: 'Reason for the unban',
					required: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { user }, reason }: Args
	) {
		utils.job.now('unban', {
			interaction,
			mod: interaction.member,
			target: user,
			reason
		});
	}
}
