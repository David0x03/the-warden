import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	GuildMember
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	target: { member: GuildMember };
	reason: string;
}

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'unmute',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to unmute',
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'reason',
					description: 'Reason for the unmute',
					required: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { member }, reason }: Args
	) {
		utils.job.now('unmute', {
			interaction,
			mod: interaction.member,
			target: member,
			reason
		});
	}
}
