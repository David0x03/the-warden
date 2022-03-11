import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ButtonStyle,
	ChatInputCommandInteraction,
	Colors,
	TextBasedChannel
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	panel: 'ra' | 'ticket' | 'agenda';
}

const choices = [
	{ name: 'Role Assignment', value: 'ra' },
	{ name: 'Ticket', value: 'ticket' },
	{ name: 'Agenda', value: 'agenda' }
];

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'panels',
			description: 'Bot Smith only',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'panel',
					description: 'Panel to send',
					required: true,
					choices
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ panel }: Args
	) {
		switch (panel) {
			case 'ra':
				await this.sendRAPanel(utils, interaction.channel!);
				break;
			case 'ticket':
				await this.sendTicketPanel(utils, interaction.channel!);
				break;
			case 'agenda':
				await this.sendAgendaPanel(utils, interaction.channel!);
				break;
		}

		utils.msg.send(interaction, {
			description: '✅ **Panel Created**',
			ephemeral: true
		});
	}

	private async sendRAPanel(utils: Utils, channel: TextBasedChannel) {
		return utils.msg.send(channel, {
			title: 'Welcome to the Jailhouse!',
			description:
				'🔞 **This server is 18+ only!**\n' +
				'> If you are found out to be underage you will be banned.\n' +
				"> This includes joking or memeing about being underage, or failing to report another member who's underage.\n\n" +
				'🔖 **Select your roles**\n' +
				'> Click the button below to gain access to the role assignment.\n' +
				"> In case this doesn't work, contact a <@&929504220544110602>",
			color: 0xbd11df,
			components: [{ label: 'Get Your Roles', customId: 'ra-start' }]
		});
	}

	private async sendTicketPanel(utils: Utils, channel: TextBasedChannel) {
		return utils.msg.send(channel, {
			title: 'Tickets & Age-Verifies',
			description:
				'When you have a problem or a question for us mods please open a Ticket with the button below.' +
				'A channel will be created for you to talk with one of our <@&929504220544110602>' +
				'We will take care of your request as soon as possible.',
			color: Colors.Red,
			components: [
				{
					label: 'Open Support Ticket',
					emoji: '🤝',
					customId: 'ticket-open-support',
					style: ButtonStyle.Danger
				},
				{
					label: 'I want to Age-Verify',
					emoji: '✅',
					customId: 'ticket-open-verify'
				}
			]
		});
	}

	private async sendAgendaPanel(utils: Utils, channel: TextBasedChannel) {
		return utils.msg.send(channel, {
			description:
				'📑 **Agenda Items**\n\n🎉 **There are no items on the agenda!**',
			components: [
				{
					customId: 'agenda-select',
					placeholder: 'Select an Option',
					options: [{ label: '🟦 Create New Agenda Item', value: 'create' }]
				}
			]
		});
	}
}
