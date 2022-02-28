import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	Colors
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	amount: number;
}

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'purge',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: 'amount',
					description: 'Amount of messages to purge',
					required: true,
					min: 1,
					max: 1000
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ amount }: Args
	) {
		interaction.deferReply({ ephemeral: true });

		const messages = await utils.getMessages(interaction.channel!, {
			limit: amount,
			includePinned: false
		});

		if (messages) await utils.deleteMessages(messages);

		utils.msg.send(interaction, {
			description: `Deleted ${messages?.length ?? 0} messages.`,
			color: Colors.Blue
		});
	}
}
