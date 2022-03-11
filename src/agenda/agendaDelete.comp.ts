import { ButtonInteraction, Colors, GuildMember, Message } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { pull } from 'lodash';
import { getItems, updateAgenda } from './agendaUtils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /agenda-delete-\d+-\d+$/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const [_, __, msgId, index] = interaction.customId.split('-');
		const message = await utils.getMessage(interaction.channel!, msgId);
		if (!message) return;

		const user = interaction.member as GuildMember;

		const items = getItems(message);
		const toRemove = items[parseInt(index)];
		pull(items, toRemove);

		updateAgenda(utils, message, items);

		(interaction.message as Message).delete();

		utils.msg.send(interaction, {
			author: {
				name: `${user.displayName} checked off an Agenda Item`,
				icon: user
			},
			fields: [{ name: toRemove.title, value: toRemove.body }],
			color: Colors.Green
		});
	}
}
