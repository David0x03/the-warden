import {
	ButtonInteraction,
	ButtonStyle,
	ChannelType,
	Colors,
	GuildMember,
	TextChannel
} from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { isMod } from '../utils';

const verifyExplanation = {
	title: 'How to Verify',
	description:
		'**What needs to be included in my verification photo?**\n' +
		'> 🔹1. A piece of paper clearly showing your full discord username, including your user number (example: JohnSmith#1234). Your username must be hand-written.\n' +
		'> \n' +
		'> 🔹2. One of the acceptable pieces of ID, as defined below, next to or placed on top of the sheet of paper with your username. Please black-out or blur your name, address, gender, photo, and any personal ID numbers that may be included on the ID. You may not blur / hide your date of birth or expiration date (if applicable).\n' +
		'> \n' +
		'> ℹ️ We must be able to clearly identify the government agency which issued the ID from the photo, so you should not blur areas of the ID that do not contain your personal identifying information.\n\n' +
		'**What forms of ID are acceptable for verification?**\n' +
		'> 🔹Any primary ID issued by a government is acceptable, provided it includes your full date of birth and is not expired. This includes but is not limited to drivers licenses, passports, birth certificates, and non-drivers ID cards.\n' +
		"> We will not accept student ID's, medical records, or any other form of identification that has not been issued by a government institution or which does not include your full date of birth.\n\n" +
		'**What happens after I submit my verification request?**\n' +
		'> 🔹A <@&929504220544110602> will review your request as soon as possible. We will review the dates and username submitted to ensure compliance with our policies.\n' +
		'> Once we are satisfied that your ID is valid and meets our requirements you can delete your verification photo and you will be given the <@&929504858732634152> role.\n' +
		'> \n' +
		'> ℹ️ We do not keep any records of your photo or other identifying information.',
	color: Colors.Orange
};

const button = {
	label: 'Close Channel',
	emoji: '🔒',
	customId: 'ticket-close',
	style: ButtonStyle.Danger
};

export default class extends ComponentEvent {
	constructor() {
		super({ customId: /ticket-open-(support|verify)$/ });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const type = interaction.customId.split('-')[2] as 'support' | 'verify';

		if (type === 'support') await this.openSupportTicket(utils, interaction);
		else if (type === 'verify') await this.openVerifyTicket(utils, interaction);
	}

	public async openSupportTicket(utils: Utils, interaction: ButtonInteraction) {
		const user = interaction.member as GuildMember;
		const userIsMod = await isMod(utils, user);

		const thread = await this.createThread(
			utils,
			interaction,
			userIsMod
				? `👮 ticket ${(Math.random() * 100) | 0}`
				: `🤝 ${user.displayName}`
		);
		if (!thread) return;

		utils.msg.update(interaction, {});

		if (!userIsMod)
			return utils.msg.send(thread, {
				content: `${user} <@&929504220544110602>`,
				author: { name: 'This is your Support Ticket', icon: user },
				description:
					'A <@&929504220544110602> will take care of your ticket as soon as possible.\n' +
					'Please describe your matters with as much information as you have.\n' +
					'You may include screenshots or message links here too.',
				color: Colors.Green,
				components: [button]
			});
		else {
			const msg = await utils.msg.send(thread, {
				content: `<@&929504220544110602>`,
				title: 'This Support Ticket was created by a Moderator',
				color: Colors.Green,
				components: [button]
			});
			if (msg) return utils.msg.update(msg, { content: null });
		}
	}

	public async openVerifyTicket(utils: Utils, interaction: ButtonInteraction) {
		const user = interaction.member as GuildMember;
		const userIsMod = await isMod(utils, user);

		const thread = await this.createThread(
			utils,
			interaction,
			userIsMod
				? `✅ verify ${(Math.random() * 100) | 0}`
				: `✅ ${user.displayName}`
		);
		if (!thread) return;

		utils.msg.update(interaction, {});

		if (!userIsMod)
			return utils.msg.send(thread, {
				content: `${user} <@&929504220544110602>`,
				embeds: [
					{
						author: { name: 'This is your Age-Verify Ticket', icon: user },
						description:
							'A <@&929504220544110602> will take care of your ticket as soon as possible.\n' +
							'Please read the instructions below and post your image in this channel.',
						color: Colors.Green
					},
					verifyExplanation
				],
				components: [button]
			});
		else {
			const msg = await utils.msg.send(thread, {
				content: `<@&929504220544110602>`,
				embeds: [
					{
						title: 'This Age-Verify Ticket was created by a Moderator',
						description:
							'This age-verify has been issued by a <@&929504220544110602> and is thus not voluntary.\n\n' +
							'We or other users have concerns that you might be underage and in order to keep this server a safe space, ask you to verify.\n' +
							'We hope you understand.',
						color: Colors.Red
					},
					verifyExplanation
				],
				components: [button]
			});
			if (msg) return utils.msg.update(msg, { content: null });
		}
	}

	private async createThread(
		utils: Utils,
		interaction: ButtonInteraction,
		name: string
	) {
		const channel = (await utils.getChannel('tickets')) as TextChannel;
		if (!channel) return;

		const user = interaction.member as GuildMember;
		const userIsMod = await isMod(utils, user);

		if (!userIsMod && (await this.hasTicket(utils, channel, interaction)))
			return;

		return channel.threads.create({
			type: ChannelType.GuildPublicThread,
			name,
			invitable: false
		});
	}

	public async hasTicket(
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
						description: `You already have an active Ticket (${thread})`,
						color: Colors.Red,
						ephemeral: true
					});
					return true;
				}
			}
	}
}
