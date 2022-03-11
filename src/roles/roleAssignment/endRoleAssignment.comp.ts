import { ButtonInteraction, Colors, GuildMember } from 'discord.js';
import { ComponentEvent, Utils } from 'griz.js';
import { defaults } from '../roles.json';

export default class extends ComponentEvent {
	constructor() {
		super({ customId: 'ra-end' });
	}

	override async run(utils: Utils, interaction: ButtonInteraction) {
		const user = interaction.member as GuildMember;

		await utils.msg.update(interaction, {
			description:
				'🌟 **You are all set!**\n\n' +
				'Now you can:\n' +
				'🔸Visit <#929482592682643466> and start chatting,\n' +
				'🔸Give <#940788934659686460> a read to figure out what this server offers,\n' +
				'🔸Introduce yourself in <#947648787663421451>,\n' +
				'🔸Or ask questions in <#943509876238319707> if you need further help!\n\n' +
				'🔞 To gain access to the NSFW sections and to keep this community safe, you can verify in <#929480767619354674>',
			color: Colors.Green,
			components: []
		});

		await user.roles.add(defaults);
	}
}
