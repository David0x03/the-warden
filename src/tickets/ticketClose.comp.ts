import {
	ButtonInteraction,
	ButtonStyle,
	Colors,
	GuildMember,
	GuildTextBasedChannel
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { isMod } from '../utils';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /ticket-(close|delete|archive)$/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const type = interaction.customId.split('-')[1];

		if (!(await isMod(utils, interaction.member as GuildMember)))
			return utils.msg.update(interaction, {});

		switch (type) {
			case 'close':
				return this.closeTicket(utils, interaction);
			case 'delete':
				return this.deleteTicket(utils, interaction);
			case 'archive':
				return this.archiveTicket(utils, interaction);
		}
	}

	private async closeTicket(utils: Utils, interaction: ButtonInteraction) {
		const channel = interaction.channel as GuildTextBasedChannel;

		if (channel.isThread()) {
			const threadMembers = (await channel.members.fetch()) as any;

			for (const threadMember of threadMembers.values()) {
				const memberIsMod = await isMod(utils, threadMember.guildMember);
				if (!memberIsMod) await threadMember.remove();
			}
		}

		return utils.msg.update(interaction, {
			components: [
				{
					label: 'Delete',
					emoji: '🗑️',
					customId: 'ticket-delete',
					style: ButtonStyle.Danger
				},
				{
					label: 'Archive',
					emoji: '🗃️',
					customId: 'ticket-archive',
					style: ButtonStyle.Danger
				}
			]
		});
	}

	private async deleteTicket(utils: Utils, interaction: ButtonInteraction) {
		const channel = interaction.channel as GuildTextBasedChannel;
		if (!channel.isThread()) return;

		utils.msg.update(interaction, { components: [] });
		await utils.msg.send(channel, {
			description: '🗑️ **Channel will be deleted in 5 seconds**',
			color: Colors.Red
		});

		setTimeout(() => channel.delete(), 5000);
	}

	private async archiveTicket(utils: Utils, interaction: ButtonInteraction) {
		const channel = interaction.channel as GuildTextBasedChannel;
		if (!channel.isThread()) return;

		utils.msg.update(interaction, { components: [] });
		await utils.msg.send(channel, { description: '🗃️ **Channel Archived**' });

		await channel.setArchived(true);
	}
}
