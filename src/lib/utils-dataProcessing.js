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

// TODO: for the google url, consider adjusting the scraper to give the url param directly, rather than manipulating via frontend
export const generateGoogleUrl = (venue) => {
	const { name = '', details = ' ' } = venue;

	const addressParts = details.split(' ');
	const postal = addressParts[addressParts.length - 1].trim();

	const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/search/?api=1&query=';
	const query = encodeURIComponent(`${name.trim()} ${postal}`);

	return `${GOOGLE_MAPS_BASE}${query}`;
};
