import { Colors, Events, Message } from 'discord.js';
import { Event, Utils } from 'griz.js';

export default class extends Event {
	constructor() {
		super({ event: Events.MessageDelete });
	}

	override async run(utils: Utils, message: Message) {
		if (!utils.guild || message.author.bot) return;
		if (!message.content && !message.attachments.size) return;

		const user = message.author;
		const member = message.member;

		const name = member?.displayName || user?.username;

		const attachments = message.attachments.map((att) => att.url);
		let description = `${user} | ${message.channel}`;

		if (message.content)
			description += `\n\`\`\`ansi\n${message.content}\`\`\``;

		utils.msg.send('messageLog', {
			embeds: [
				{
					author: { name: `${name} | Delete`, icon: member || user },
					description,
					image: attachments[0] ?? null,
					color: Colors.Red,
					footer: attachments.length <= 1 ? user : null
				},
				...attachments.slice(1).map((url, i) => ({
					image: url,
					color: Colors.Red,
					footer: i === attachments.length - 2 ? user : null
				}))
			]
		});
	}
}
