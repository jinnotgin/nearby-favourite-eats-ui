import { browser } from '$app/env';

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// https://jaredtong.com/burpple-beyond/
// https://github.com/tongrhj/lickilicky/blob/79d12e46aeaf5a404d72c75c68cd48399639d236/index.html#L185-L209
export const sortFuncs = {
	name: function (a, b) {
		if (a.name > b.name) {
			return 1;
		} else if (a.name < b.name) {
			return -1;
		} else {
			return 0;
		}
	},
	price: function (a, b) {
		function extractPrice(formatted_price) {
			var price = (formatted_price && formatted_price.match(/\d/g).join('')) || 0;
			return parseInt(price, 10);
		}
		return extractPrice(a.formatted_price) - extractPrice(b.formatted_price);
	},
	nearby: function (a, b, targetPosition) {
		function haversineDistance(p1, p2) {
			var atan2 = Math.atan2;
			var cos = Math.cos;
			var sin = Math.sin;
			var sqrt = Math.sqrt;
			var PI = Math.PI;
			var R = 6378137; // (mean) radius of Earth (meters)

			function squared(x) {
				return x * x;
			}
			function toRad(x) {
				return (x * PI) / 180.0;
			}
			var aLat = p1.latitude;
			var bLat = p2.latitude;
			var aLng = p1.longitude;
			var bLng = p2.longitude;

			var dLat = toRad(bLat - aLat);
			var dLon = toRad(bLng - aLng);

			var f =
				squared(sin(dLat / 2.0)) + cos(toRad(aLat)) * cos(toRad(bLat)) * squared(sin(dLon / 2.0));
			var c = 2 * atan2(sqrt(f), sqrt(1 - f));

			return R * c;
		}
		var origin = {
			latitude: targetPosition.coords.latitude,
			longitude: targetPosition.coords.longitude
		};
		return haversineDistance(origin, a.location) - haversineDistance(origin, b.location);
	}
};

export const isDemoMode = () => {
	return browser ? location.href.includes('?demo') : false;
};
