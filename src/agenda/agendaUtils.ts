import { Message } from 'discord.js';
import { Utils } from 'griz.js';

interface AgendaItem {
	title: string;
	body: string;
}

export function updateAgenda(
	utils: Utils,
	message: Message,
	items?: AgendaItem[]
) {
	if (!items) items = getItems(message);

	const fields = items.map((item) => ({ name: item.title, value: item.body }));

	const options = items.map((item, i) => {
		return { label: item.title, value: i.toString() };
	});
	options.unshift({ label: '🟦 Create New Agenda Item', value: 'create' });

	utils.msg.update(message, {
		description: fields.length
			? '📑 **Agenda Items**'
			: '📑 **Agenda Items**\n\n🎉 **There are no items on the agenda!**',
		fields,
		components: [
			{ customId: 'agenda-select', placeholder: 'Select an Option', options }
		]
	});
}

export function getItems(message: Message) {
	const fields = message.embeds[0]?.fields ?? [];
	return fields.map((field) => ({ title: field.name, body: field.value }));
}
