import {
	ButtonStyle,
	Colors,
	GuildMember,
	Message,
	ModalSubmitInteraction
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { getItems, updateAgenda } from './agendaUtils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'agenda-create' });
	}

	override async run(
		utils: Utils,
		interaction: ModalSubmitInteraction,
		{ title, body }: { title: string; body?: string }
	) {
		if (!interaction.isFromMessage()) return;
		const message = interaction.message as Message;
		const user = interaction.member as GuildMember;

		title = `🔸 ${title}`;
		body ||= '*No Description*';

		const items = getItems(message);
		items.push({ title, body });

		updateAgenda(utils, message, items);

		utils.msg.send(interaction, {
			author: {
				name: `${user.displayName} created a new Agenda Item`,
				icon: user
			},
			fields: [{ name: title, value: body }],
			color: Colors.Green,
			components: [
				{
					label: 'Create Thread',
					customId: 'agenda-thread',
					style: ButtonStyle.Success
				}
			]
		});
	}
}
