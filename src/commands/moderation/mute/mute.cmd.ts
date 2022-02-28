import {
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	GuildMember
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	target: { member: GuildMember | undefined };
	duration: number;
	reason: string;
}

const durationChoices = [
	{ name: '1 Hour', value: 60 * 60 * 1000 },
	{ name: '12 Hours', value: 12 * 60 * 60 * 1000 },
	{ name: '24 Hours', value: 24 * 60 * 60 * 1000 },
	{ name: '72 Hours', value: 72 * 60 * 60 * 1000 },
	{ name: '7 Days', value: 7 * 24 * 60 * 60 * 1000 },
	{ name: 'Manual Unmute', value: 0 }
];

const reasons = [
	{
		name: 'Awaiting age-verify',
		value: 'Awaiting age-verify'
	},
	{
		name: 'Ignoring Moderators',
		value:
			'Ignoring Moderators, mute stays in place until the situation is resolved'
	},
	{
		name: 'Spamming friend requests',
		value: 'Spamming friend requests'
	},
	{ name: 'No reason', value: 'No reason given' }
];

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'mute',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to mute',
					required: true
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: 'duration',
					description: 'Duration of the mute',
					required: true,
					choices: durationChoices
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'reason',
					description: 'Reason for the mute',
					required: true,
					autocomplete: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { member }, duration, reason }: Args
	) {
		utils.job.now('mute', {
			interaction,
			mod: interaction.member,
			target: member,
			duration,
			reason
		});
	}

	override onAutocomplete(
		utils: Utils,
		interaction: AutocompleteInteraction,
		{ value }: ApplicationCommandOptionChoice
	) {
		const filtered = reasons.filter((r) =>
			r.name.toLowerCase().includes((value as string).toLowerCase())
		);

		if ((value as string).length > 1)
			return [...filtered, { name: value, value }];
		return [
			...filtered,
			{ name: '(type to enter a custom reason)', value: 'No reason given' }
		];
	}
}
