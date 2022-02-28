import { Guild, Invite } from 'discord.js';

interface InviteStat {
	code: string;
	uses: number;
	inviterId: string | null;
}

const inviteStats = new Map<string, InviteStat[]>();
const lastInvites = new Map<string, InviteStat>();

export async function getLastUsedInvite(guild: Guild) {
	const invites = await guild.invites.fetch();

	const stats = inviteStats.get(guild.id);
	if (!stats) return;

	const usedInvite = stats.find(({ code, uses }) => {
		const invite = invites.get(code);
		if (!invite) return;
		return invite.uses! > uses;
	});

	return usedInvite ?? lastInvites.get(guild.id);
}

export async function updateInviteStats(guild: Guild) {
	const invites = await guild.invites.fetch();

	inviteStats.set(
		guild.id,
		invites.map((invite) => ({
			code: invite.code,
			uses: invite.uses!,
			inviterId: invite.inviterId
		}))
	);
}

export function updateLastInvite(invite: Invite) {
	const lastInvite = inviteStats
		.get(invite.guild!.id)
		?.find(({ code }) => code === invite.code);

	if (lastInvite) lastInvites.set(invite.guild!.id, lastInvite);
	updateInviteStats(invite.guild as Guild);
}
