import {
	ApplicationCommandType,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { Command, Utils } from 'griz.js';
import { sendModLog, UserArgs } from './sendModLog';

export default class extends Command {
	constructor() {
		super({ type: ApplicationCommandType.User, name: 'Mod-Log' });
	}

	override async run(
		utils: Utils,
		interaction: UserContextMenuCommandInteraction,
		user: UserArgs
	) {
		sendModLog(utils, interaction, user, true);
	}
}
