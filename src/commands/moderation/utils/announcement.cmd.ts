import {
	ApplicationCommandType,
	ButtonInteraction,
	ButtonStyle,
	Colors,
	Message,
	MessageContextMenuCommandInteraction
} from 'discord.js';
import { Command, Utils } from 'griz.js';
import { errorResponse } from '../../../utils';

export default class extends Command {
	constructor() {
		super({ type: ApplicationCommandType.Message, name: 'Announcement' });
	}

	override async run(
		utils: Utils,
		interaction: MessageContextMenuCommandInteraction,
		{ message }: { message: Message }
	) {
		if (!message.content)
			return errorResponse(
				interaction,
				"This message can't be turned into an announcement"
			);

		const msg = await utils.msg.send(interaction, {
			description: message.content,
			components: this.getButtons(false)
		});

		utils.col.onButton(msg!, {
			time: 30 * 60 * 60,
			onPress: (i) => {
				if (i.customId.match(/ping-(true|false)/)) this.togglePing(utils, i);
				else if (i.customId === 'refresh') this.refreshEmbed(utils, i, message);
				else if (i.customId === 'cancel') this.cancel(i);
				else if (i.customId === 'send') this.send(utils, i, message);
			}
		});
	}

	private async togglePing(utils: Utils, interaction: ButtonInteraction) {
		const [_, ping] = interaction.customId.split('-');
		let buttons = [];

		if (ping === 'true') buttons = this.getButtons(false);
		else buttons = this.getButtons(true);

		utils.msg.update(interaction, { components: buttons });
	}

	private async refreshEmbed(
		utils: Utils,
		interaction: ButtonInteraction,
		message: Message
	) {
		message = await message.fetch();
		utils.msg.update(interaction, { description: message.content });
	}

	private async cancel(interaction: ButtonInteraction) {
		(interaction.message as Message).delete();
	}

	private async send(
		utils: Utils,
		interaction: ButtonInteraction,
		message: Message
	) {
		const wh = await utils.getWebhook('announcements', 'Server Announcements');
		const ping = this.shouldPing(interaction);

		utils.msg.send(wh!, {
			content: ping ? '@everyone' : undefined,
			description: message.content,
			color: 0x9013fe,
			webhook: { avatar: utils.guild! }
		});

		utils.msg.update(interaction, {
			description: '📣 **Announcement send**',
			color: Colors.Green,
			components: []
		});
	}

	private getButtons(pingState: boolean) {
		return [
			[
				{
					label: `@everyone: ${pingState ? 'yes' : 'no'}`,
					customId: `ping-${pingState ? 'true' : 'false'}`
				},
				{ label: 'Refresh', customId: 'refresh' }
			],
			[
				{ label: 'Cancel', customId: `cancel`, style: ButtonStyle.Danger },
				{ label: 'Send', customId: `send`, style: ButtonStyle.Success }
			]
		];
	}

	private shouldPing(interaction: any) {
		const button = interaction.message.components[0].components[0].data;
		return button.custom_id.split('-')[1] === 'true';
	}
}
