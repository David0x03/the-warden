import { humanizer } from 'humanize-duration';

const shortEnglishHumanizer = humanizer({
	language: 'shortEn',
	languages: {
		shortEn: {
			y: () => 'y',
			mo: () => 'mo',
			w: () => 'w',
			d: () => 'd',
			h: () => 'h',
			m: () => 'm',
			s: () => 's'
		}
	}
});

export function humanDuration(ts: number) {
	return shortEnglishHumanizer(Date.now() - ts, {
		conjunction: ' ',
		spacer: '',
		serialComma: false,
		largest: 2,
		round: true
	});
}

export function ts(ts: number, type?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R') {
	return `<t:${(ts / 1000) | 0}:${type ?? 'D'}>`;
}
