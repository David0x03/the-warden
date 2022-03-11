import {
	ButtonInteraction,
	GuildMember,
	InteractionCollector,
	InteractionType,
	Message,
	ModalSubmitInteraction,
	TextInputStyle
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { getItems, updateAgenda } from './agendaUtils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /agenda-edit-\d+-\d+$/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const [_, __, msgId, index] = interaction.customId.split('-');

		const message = await utils.getMessage(interaction.channel!, msgId);
		if (!message) return;

		const user = interaction.member as GuildMember;

		const items = getItems(message);
		const toEdit = items[parseInt(index)];

		const customId = Date.now().toString();
		utils.msg.showModal(interaction, {
			title: 'Edit Agenda Item',
			customId,
			components: [
				{
					label: 'Title',
					customId: 'title',
					placeholder: 'The Title of the Agenda Item',
					value: toEdit.title,
					maxLength: 100
				},
				{
					label: 'Description (optional)',
					customId: 'body',
					placeholder: 'The Description of the Agenda Item',
					value: toEdit.body,
					maxLength: 1000,
					required: false,
					style: TextInputStyle.Paragraph
				}
			]
		});

		const collector = new InteractionCollector(utils.client, {
			interactionType: InteractionType.ModalSubmit,
			time: 15 * 60 * 1000,
			max: 1,
			filter: (i: ModalSubmitInteraction) => i.customId === customId
		});

		collector.on('collect', (i) => {
			const title = i.fields.getTextInputValue('title');
			const body = i.fields.getTextInputValue('body') || '*No Description*';

			items[parseInt(index)] = { title, body };

			updateAgenda(utils, message, items);

			(interaction.message as Message).delete();

			utils.msg.send(i, {
				author: {
					name: `${user.displayName} edited an Agenda Item`,
					icon: user
				},
				fields: [{ name: title, value: body }]
			});
		});
	}
}
