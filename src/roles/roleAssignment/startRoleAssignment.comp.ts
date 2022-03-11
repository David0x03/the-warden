import { ThreadAutoArchiveDuration } from 'discord-api-types/v10';
import {
	ButtonInteraction,
	ButtonStyle,
	ChannelType,
	Colors,
	GuildMember,
	TextChannel
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'ra-start' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		await utils.db.updateUser(interaction.user.id, {
			$set: { local: interaction.locale }
		});

		const thread = await this.createThread(utils, interaction);
		if (!thread) return;

		utils.msg.update(interaction, {});

		utils.msg.send(thread, {
			content: `${interaction.member} this is your role assignment!`,
			description:
				'🔖 **Role Assignment**\n\n' +
				'In case you need assistance, click on "I need help" and a moderator will be with you shortly.',
			components: [
				{
					label: 'Start Role Assignment',
					customId: 'ra-gender',
					style: ButtonStyle.Success
				},
				{ label: 'I need Help', customId: 'ra-help', style: ButtonStyle.Danger }
			]
		});
	}

	private async createThread(utils: Utils, interaction: ButtonInteraction) {
		const channel = (await utils.getChannel('roleAssignment')) as TextChannel;
		if (!channel) return;

		const user = interaction.member as GuildMember;
		if (await this.hasRoleAssignment(utils, channel, interaction)) return;

		return channel.threads.create({
			type: ChannelType.GuildPublicThread,
			name: `🔖 ${user.displayName}`,
			autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
			invitable: false
		});
	}

	public async hasRoleAssignment(
		utils: Utils,
		channel: TextChannel,
		interaction: ButtonInteraction
	) {
		const threads = await utils.getActiveThreads(channel);

		if (threads)
			for (const thread of threads) {
				const members = (await thread.members.fetch()) as any;
				if (members.has(interaction.user.id)) {
					utils.msg.send(interaction, {
						description: `You already have an active Role Assignment (${thread})`,
						color: Colors.Red,
						ephemeral: true
					});
					return true;
				}
			}
	}
}
