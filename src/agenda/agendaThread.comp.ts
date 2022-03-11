import { ButtonInteraction, Message } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { truncate } from 'lodash';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'agenda-thread' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		if (!('threads' in interaction.channel!)) return;
		const message = interaction.message as Message;
		const title = message.embeds[0].fields![0].name.replace(/^🔸/, '');

		utils.msg.update(message, { components: [] });

		const thread = await interaction.channel.threads.create({
			name: `📑 ${truncate(title, { length: 20 })}`,
			startMessage: interaction.message.id
		});

		utils.msg.send(thread, { content: '<@&929504220544110602>' });
	}
}
