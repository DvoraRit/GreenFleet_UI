export const ZOOM_DEFAULT = 10;
export const HISTORY_CAR_LINE_TYPE = 'LINE'; //"LINE / DOTS"
export const CENTER_DEFAULT = {
	lat: parseFloat(31.955533497440502),
	lng: parseFloat(35.25943106269921),
};
export const CENTER_BY_COMPANY = {
	100: {
		lat: parseFloat(31.955533497440502),
		lng: parseFloat(35.25943106269921),
	},
	200: {
		lat: parseFloat(32.1957049),
		lng: parseFloat(34.8774996),
	},
};
export const SET_INTERVAL_LOCATION = 5000;
export const SET_INTERVAL_TRIP_ALERTS = 30000;
export const MAX_TRIPS_FOR_DRIVER = 20;

export const SET_INTERVAL_UPDATE_RESOURCES = 5000;
export const COMPONYID_DEFAULT = 1;
export const ZONE_DEFAULT = ['e', 'n'];
export const TIME_OF_TO_SAVE_ZOOM_AND_CENTER = 300000;
export const ClUSTERER_FILTER = true;
export const TEST_HR_OBJ = {
	order_id: 1,
	planning_id: 4,
	issue_type: 'discipline',
	start_date: '12.02.22',
	start_time: '13:30',
	end_day: '12-02-22',
	day_at_week: 2,
	end_time: '20:00',
	nick_name: 'John',
	trip_name: 'רעננה',
	created_by: 'איציק',
	role: 'inspector',
	user_type: '',
	user_phone: '9720582068714',
	repete_every: 'day',
	is_active: 1,
	lattitude: '31.5',
	longitude: '35.5',
};

export const vectorAndHistoryCircleOptions = {
	strokeColor: 'black',
	strokeOpacity: 0,
	strokeWeight: 1,
	fillColor: 'black',
	fillOpacity: 1,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
	zIndex: 1,
};

export const vectorAndHistoryLineOptions = {
	strokeColor: '#FF0000',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#FF0000',
	fillOpacity: 0.35,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
	radius: 30000,
	zIndex: 1,
};

export const toastDefaultConfig = {
	position: 'bottom-left',
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
};
