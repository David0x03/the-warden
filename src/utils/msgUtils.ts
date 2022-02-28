import { Colors, CommandInteraction } from 'discord.js';
import { Utils } from 'griz.js';

export async function errorResponse(
	interaction: CommandInteraction,
	message: string
) {
	const utils = await Utils.get();

	return utils.msg.send(interaction, {
		description: message,
		color: Colors.Red,
		ephemeral: true
	});
}
