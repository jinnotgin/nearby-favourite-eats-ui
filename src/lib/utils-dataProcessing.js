export const savedPositions = {
	central: {
		name: 'central',
		coords: { latitude: 1.2979292236801285, longitude: 103.83747174457848 }
	},
	east: { name: 'east', coords: { latitude: 1.3198961460010883, longitude: 103.92639233213994 } },
	west: { name: 'west', coords: { latitude: 1.3408331882693638, longitude: 103.72623517944368 } },
	north: {
		name: 'north',
		coords: { latitude: 1.4146262348752339, longitude: 103.80107953499733 }
	}
};

// dirty function for categories
export const categoriesList = [
	'Japanese',
	'Korean',
	'Western',
	'Italian',
	'Chinese',
	'Indian',
	'Thai',
	'Vietnamese',
	'Taiwanese',
	'French',
	'European',
	'Mediterranean',
	'Mexican',
	'Vegetarian',
	'Halal',
	'Breakfast & Brunch',
	'Local Delights',
	'Hawker Food',
	'Kopitiam',
	'Zi Char',
	'Cafes & Coffee',
	'Late Night',
	'Bread & Pastries',
	'Pasta',
	'Ramen',
	'Salads',
	'Desserts',
	'Bubble Tea',
	'Bars'
];
export const allowedCategories = (array) => array.filter((item) => categoriesList.includes(item));

// dirty function to get opening hours
const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNow = dayMap[new Date().getDay()];
export const openingHoursToday = (textStr) => {
	if (!!!textStr.includes(dayNow)) return '';
	return textStr.split(`${dayNow}:`)[1].split('\n')[0];
};
export const isClosedNow = (_textStr = '') => {
	const textStr = _textStr.trim();
	if (textStr === '') return false;

	const sgTimeStrToNumber = (timeStr) => {
		if (!/[\d]{2}:[\d]{2}[ap]m/.test(timeStr)) {
			console.error('sgTimeStrToUTCNumber: invalid input');
			return 0;
		}

		const hour = parseInt(timeStr.substr(0, 2));
		const minute = parseInt(timeStr.substr(3, 2));
		const ampm = timeStr.substr(5, 2);

		let hour24;
		if (ampm === 'am' && hour === 12) hour24 = 0;
		else if (ampm === 'pm' && hour < 12) hour24 = hour + 12;
		else hour24 = hour;

		const number = minute + hour24 * 60;
		// console.log({ hour, minute, ampm, hour24, number });
		return number;
	};
	const sgTimeStrToUTCNumber = (timeStr) => {
		const utcNumber = sgTimeStrToNumber(timeStr) - 8 * 60;
		// console.log({ utcNumber });
		return utcNumber;
	};

	const timeRangeSplit = (_timeRange) => {
		const timeRange = _timeRange.trim();

		if (timeRange === 'Open 24 hours') return [`12:00am`, `11:59pm`];

		const times = timeRange.split(' - ');
		const startTime = times.length == 2 ? times[0] : `12:00am`;
		const endTime = times.length == 2 ? times[1] : `12:00am`;

		return [startTime, endTime];
	};

	const _isOpenNow = (timeRange) => {
		const [startTimeStr, endTimeStr] = timeRangeSplit(timeRange);
		const startUICNumber = sgTimeStrToUTCNumber(startTimeStr);
		const endUTCNumber = sgTimeStrToUTCNumber(endTimeStr);

		const now = new Date();
		const currentUTCNumber = now.getUTCHours() * 60 + now.getUTCMinutes();

		let isOpenNow = currentUTCNumber >= startUICNumber && currentUTCNumber <= endUTCNumber;
		// console.log({ startUICNumber, endUTCNumber, currentUTCNumber, isOpenNow });

		return isOpenNow;
	};

	const rawTimeRanges = textStr.split(',');
	let timeRanges = [];
	for (const rawTimeRange of rawTimeRanges) {
		const [startTimeStr, endTimeStr] = timeRangeSplit(rawTimeRange);
		const startNumber = sgTimeStrToNumber(startTimeStr);
		let endNumber = sgTimeStrToNumber(endTimeStr);

		if (endNumber < startNumber) {
			timeRanges.push(`${startTimeStr} - 11:59pm`);
			timeRanges.push(`12:00am - ${endTimeStr}`);
		} else timeRanges.push(rawTimeRange);
	}

	const isItOpen = timeRanges.some(_isOpenNow);
	return !isItOpen;
};

// TODO: for the google url, consider adjusting the scraper to give the url param directly, rather than manipulating via frontend
export const generateGoogleUrl = (venue) => {
	const { name = '', details = ' ' } = venue;

	const addressParts = details.split(' ');
	const postal = addressParts[addressParts.length - 1].trim();

	const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/search/?api=1&query=';
	const query = encodeURIComponent(`${name.trim()} ${postal}`);

	return `${GOOGLE_MAPS_BASE}${query}`;
};
