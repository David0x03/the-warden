import { Colors, Events, VoiceState } from 'discord.js';
import { Event, Utils } from 'griz.js';

export default class extends Event {
	constructor() {
		super({ event: Events.VoiceStateUpdate });
	}

	override async run(utils: Utils, oldState: VoiceState, newState: VoiceState) {
		if (!utils.guild) return;
		if (oldState.channel === newState.channel) return;

		if (!oldState.channel && newState.channel)
			return utils.msg.send('voiceLog', {
				author: {
					name: `${newState.member!.displayName} | Join`,
					icon: newState.member
				},
				description: `${newState.channel}`,
				color: Colors.Green,
				footer: newState.member
			});

		if (oldState.channel && !newState.channel)
			return utils.msg.send('voiceLog', {
				author: {
					name: `${newState.member!.displayName} | Left`,
					icon: newState.member
				},
				description: `${oldState.channel}`,
				color: Colors.Red,
				footer: newState.member
			});

		if (oldState.channel !== newState.channel)
			return utils.msg.send('voiceLog', {
				author: {
					name: `${newState.member!.displayName} | Move`,
					icon: newState.member
				},
				description: `${oldState.channel} ➡️ ${newState.channel}`,
				color: Colors.Blue,
				footer: newState.member
			});
	}
}
