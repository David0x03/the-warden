import { Events, IntentsBitField, Partials } from 'discord.js';
import { GrizClient } from 'griz.js';
import { token, clientOptions } from './config.json';

const Intents = IntentsBitField.Flags;

const client = new GrizClient({
	intents: [
		Intents.Guilds,
		Intents.GuildMessages,
		Intents.GuildMembers,
		Intents.GuildVoiceStates,
		Intents.GuildInvites
	],
	partials: [Partials.User, Partials.GuildMember],
	...(clientOptions as any)
});

process.on('uncaughtException', (error) => {
	client.emit(Events.Error, error);
});

client.login(token);
