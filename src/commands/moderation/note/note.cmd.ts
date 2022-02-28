import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	GuildMember
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	target: { member: GuildMember | undefined };
	note: string;
}

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'note',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to make a note about',
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'note',
					description: 'The note',
					required: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { member }, note }: Args
	) {
		utils.job.now('note', {
			interaction,
			mod: interaction.member,
			target: member,
			note
		});
	}
}
