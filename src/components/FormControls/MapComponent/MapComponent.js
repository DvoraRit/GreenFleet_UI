import React, { useState, useEffect, useCallback } from 'react';
import { useObserver, observer } from 'mobx-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { GOOGLE_MAP_API_KEY } from 'config/googleApi';
import { useRecoilState } from 'recoil';
import { CONTAINER_STYLE } from './config';
import { ZOOM_DEFAULT } from 'config/config';
import mapStyles from './mapStyles';
import { centerMap, zoomMap, mapZoomValue, textDir } from 'recoil/atoms';
import DriverMarker from './iconForCreate.svg';
import TableDataService from 'services/TableDataService';

const MapComponent = (props) => {
	const [openNoResult, setOpenNoResult] = useState(false);

	// GOOGLE MAP
	const [centerMapResource, setCenterMapResource] = useRecoilState(centerMap);
	const [mapCurrentBoundary, setMapCurrentBoundary] = useState();
	const [zoomMapResource, setZoomMapResource] = useRecoilState(zoomMap);
	const [mapZoom, setMapZoom] = useRecoilState(mapZoomValue);
	const [lat, setLat] = useState(props.lat ? props.lat : 0);
	const [lng, setLng] = useState(props.lng ? props.lng : 0);
// console.log(lat,lng);
	const [map, setMap] = useState(null);

	const [textDirection, setTextDirection] = useRecoilState(textDir);
	const language = textDirection === 'RTL' ? 'he' : 'en';

	const { isLoaded, loadError } = useJsApiLoader({
		id: 'GF-map',
		googleMapsApiKey: GOOGLE_MAP_API_KEY, // NB: NEED DIFFERENT API KEY
		language: language,
	});

	const onUnmount = useCallback(function callback(map) {
		setMap(null);
	}, []);

	function getBoundary() {
		let east = map.getBounds().getNorthEast().lng();
		let south = map.getBounds().getSouthWest().lat();
		let west = map.getBounds().getSouthWest().lng();
		let north = map.getBounds().getNorthEast().lat();
		let bounds = { w: west, e: east, n: north, s: south };
		setMapCurrentBoundary(bounds);
	}
	const listener = () => {
		getBoundary();
	};

	const handleMapClick = (e) => {
		let position = e.latLng.toJSON();
		let latitude = position.lat;
		let longitude = position.lng;
		setLat(position.lat);
		setLng(position.lng);
		switch (props.table_name) {
			case "all_stations":
				props.setFieldValue("latitude",`${latitude},${longitude}` );
				TableDataService.getAddressByLocation({ latitude, longitude })
				.then((res) => {
				if (!!res) {
					props.setFieldValue("station_name",res);
					props.setFieldValue("address",res);
				}
			})
			.catch((error) => console.error('error get getAddressByLocation', error));

			break;
		
			default:
				TableDataService.getAddressByLocation({ latitude, longitude })
				.then((res) => {
				if (!!res) {
					if(props.table_name==='drivers'){
						props.setFieldValue("city",res)

					}else{
						props.setFieldValue("address",res)

					}
				}
			})
			.catch((error) => console.error('error get getAddressByLocation', error));
				break;
		}
		
	};

	const onLoad = useCallback(function callback(map) {
		const bounds = new window.google.maps.LatLngBounds(); //TODO:  what is this for?
		setTimeout(function () {
			setMap(map);
		}, 1000);
	}, []);

	const handleCloseNoResult = () => {
		setOpenNoResult(false);
	};

	return (
		<div>
			{isLoaded && (
				<GoogleMap
					onLoad={onLoad}
					clickableIcons
					mapContainerStyle={CONTAINER_STYLE}
					onUnmount={onUnmount}
					center={centerMapResource}
					zoom={zoomMapResource}
					onZoomChanged={() =>
						setMapZoom(map && map.zoom ? map.zoom : ZOOM_DEFAULT)
					}
					options={{
						zoomControl: false,
						mapTypeControl: false,
						scaleControl: false,
						streetViewControl: false,
						rotateControl: false,
						fullscreenControl: false,
						styles: mapStyles,
					}}
					onClick={(e) => handleMapClick(e)}
				>
					{lat && lng && (
						<Marker
							position={{
								lat: parseFloat(lat) ?? 0,
								lng: parseFloat(lng) ?? 0,
							}}
							icon={DriverMarker}
						/>
					)}
				</GoogleMap>
			)}
		</div>
	);
};

export default observer(MapComponent);
