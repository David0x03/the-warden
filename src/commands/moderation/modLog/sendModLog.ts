import { Colors, CommandInteraction, GuildMember, User } from 'discord.js';
import { Utils } from 'griz.js';
import { humanDuration, ts } from '../../../utils';

export interface UserArgs {
	user: User;
	member?: GuildMember;
}

interface ModLogEntry {
	action: string;
	ts: Date;
	mod: string;
	reason: string;
}

export async function sendModLog(
	utils: Utils,
	interaction: CommandInteraction,
	{ user, member }: UserArgs,
	ephemeral: boolean
) {
	const dbEntry = (await utils.db.user(user.id)) ?? {};
	const name = member ? member.displayName : user.username;

	const created = user.createdTimestamp;
	const joined = member?.joinedTimestamp ?? 0;

	const modLog = (dbEntry.modLog ?? []).map((entry: ModLogEntry) => {
		const { action, ts: timestamp, mod, reason } = entry;
		return (
			`**${action}** | ` +
			`${ts(new Date(timestamp).getTime())} | ` +
			`<@${mod}>\n` +
			`*${reason}*`
		);
	});

	utils.msg.send(interaction, {
		author: { name: `Mod-Log for ${name}`, icon: user },
		description:
			`👤 ${user}\n` +
			`📅 ${ts(created)} (${humanDuration(created)})\n` +
			`📥 ${ts(joined)} (${humanDuration(joined)})\n\n` +
			'👮 **Mod-Log**\n' +
			`${modLog.length ? modLog.join('\n\n') : '❌ No Entries'}`,
		footer: user,
		color: Colors.Blue,
		ephemeral
	});
}
