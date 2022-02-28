import {
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	GuildMember,
	User
} from 'discord.js';
import { Command, Utils } from 'griz.js';

interface Args {
	target: { member: GuildMember | undefined; user: User };
	reason: string;
}

const reasons = [
	{
		name: 'Ban evasion',
		value: 'Ban evasion'
	},
	{
		name: 'Failed to age-verify',
		value: 'Failed to age-verify'
	},
	{
		name: 'Failure to follow Moderator orders',
		value: 'Failure to follow Moderator orders'
	},
	{
		name: 'Multi-accounting',
		value: 'Multi-accounting'
	},
	{
		name: 'Raid',
		value: 'Raid'
	},
	{
		name: 'Scamming',
		value: 'Scamming'
	},
	{
		name: 'Spamming friend requests',
		value: 'Spamming friend requests'
	},
	{
		name: 'Trolling',
		value: 'Trolling'
	},
	{
		name: 'Underage',
		value: 'Underage'
	},
	{ name: 'No reason', value: 'No reason given' }
];

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'ban',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to ban',
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'reason',
					description: 'Reason for the ban',
					required: true,
					autocomplete: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { member, user }, reason }: Args
	) {
		utils.job.now('ban', {
			interaction,
			mod: interaction.member,
			target: member ?? user,
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
