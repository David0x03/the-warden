import { Colors, Events, Message } from 'discord.js';
import { Event, Utils } from 'griz.js';
import { newEmote, oldEmote } from '../../utils';

export default class extends Event {
	constructor() {
		super({ event: Events.MessageUpdate });
	}

	override async run(utils: Utils, oldMsg: Message, newMsg: Message) {
		if (!utils.guild || newMsg.author.bot) return;
		if (oldMsg.content === newMsg.content) return;

		const member = newMsg.member!;

		let oldContent =
			`${member} | ${newMsg.channel}\n\n` +
			`${oldEmote}\n` +
			`\`\`\`${oldMsg.content}\`\`\``;

		let newContent = `${newEmote}\n` + `\`\`\`${newMsg.content}\`\`\``;

		if (oldContent.length + newContent.length >= 5500)
			return this.splitMessage(utils, newMsg, oldContent, newContent);

		utils.msg.send('messageLog', {
			author: { name: `${member.displayName} | Edit`, icon: member },
			description: `${oldContent}\n${newContent}`,
			color: Colors.Yellow,
			footer: member,
			components: [{ label: 'Jump to Message', url: newMsg.url }]
		});
	}

	private async splitMessage(
		utils: Utils,
		{ member, url }: Message,
		oldContent: string,
		newContent: string
	) {
		await utils.msg.send('messageLog', {
			author: { name: `${member!.displayName} | Edit`, icon: member },
			description: oldContent,
			color: Colors.Yellow
		});

		utils.msg.send('messageLog', {
			description: newContent,
			color: Colors.Yellow,
			footer: member!.avatar,
			components: [{ label: 'Jump to Message', url }]
		});
	}
}
