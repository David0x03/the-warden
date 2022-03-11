import {
	ButtonStyle,
	Message,
	SelectMenuInteraction,
	TextInputStyle
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { getItems, updateAgenda } from './agendaUtils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'agenda-select' });
	}

	override async run(
		utils: Utils,
		interaction: SelectMenuInteraction,
		[value]: [string]
	) {
		if (value === 'create') this.createItem(utils, interaction);
		else this.editItem(utils, interaction, value);

		updateAgenda(utils, interaction.message as Message);
	}

	private async editItem(
		utils: Utils,
		interaction: SelectMenuInteraction,
		index: string
	) {
		const message = interaction.message as Message;
		const item = getItems(message)[parseInt(index)];
		if (!item) return;

		utils.msg.send(interaction, {
			description: `📝 **Edit Agenda Item**`,
			fields: [{ name: item.title, value: item.body }],
			components: [
				[
					{
						label: 'Edit',
						customId: `agenda-edit-${message.id}-${index}`,
						style: ButtonStyle.Primary
					},
					{
						label: 'Check Off (Delete)',
						customId: `agenda-delete-${message.id}-${index}`,
						style: ButtonStyle.Success
					}
				],
				[
					{
						label: 'Cancel',
						customId: `agenda-cancel`,
						style: ButtonStyle.Secondary
					}
				]
			]
		});
	}

	private createItem(utils: Utils, interaction: SelectMenuInteraction) {
		utils.msg.showModal(interaction, {
			title: 'Create Agenda Item',
			customId: 'agenda-create',
			components: [
				{
					label: 'Title',
					customId: 'title',
					placeholder: 'The Title of the Agenda Item',
					maxLength: 99
				},
				{
					label: 'Description (optional)',
					customId: 'body',
					placeholder: 'The Description of the Agenda Item',
					maxLength: 1000,
					required: false,
					style: TextInputStyle.Paragraph
				}
			]
		});
	}
}
