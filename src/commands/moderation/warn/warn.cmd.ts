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
	reason: string;
}

const reasons = [
	{
		name: 'Disrespectful behavior',
		value: 'Disrespectful behavior'
	},
	{
		name: 'Inappropriate Nickname',
		value:
			'Nickname did not follow server rules, refused to change the nickname'
	},
	{
		name: 'Not following Moderator orders',
		value: 'Not following Moderator orders'
	},
	{
		name: 'Spamming friend requests',
		value: 'Spamming friend requests'
	},
	{
		name: 'Violating consent',
		value: 'Violating consent'
	},
	{ name: 'No reason', value: 'No reason given' }
];

export default class extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: 'warn',
			description: 'Moderator only',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'target',
					description: 'User to warn',
					required: true
				},
				{
					type: ApplicationCommandOptionType.String,
					name: 'reason',
					description: 'Reason for the warn',
					required: true,
					autocomplete: true
				}
			]
		});
	}

	override async run(
		utils: Utils,
		interaction: ChatInputCommandInteraction,
		{ target: { member }, reason }: Args
	) {
		utils.job.now('warn', {
			interaction,
			mod: interaction.member,
			target: member,
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
