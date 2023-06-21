export const ControlLayers = (controlLayers, state) => {
	switch (controlLayers.toString()) {
		case 'allRecords':
			return (state.allRecords = true);
		case 'filterRecord':
			state.filterRecord = true;
			break;
		case 'stations':
		 state.stations = true;
			break;
		case 'pointsOfInterest':
			return (state.pointsOfInterest = true);
		case 'cars':
			state.cars = true;
			break;
		case 'traffic':
			return (state.traffic = true);
		case 'active':
			return (state.active = true);
		case 'expected':
			return (state.expected = true);
		case 'finish':
			return (state.finish = true);
		default:
			break;
	}
	return state;
};
