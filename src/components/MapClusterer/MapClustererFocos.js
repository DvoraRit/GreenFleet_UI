import React, { useState } from 'react';
import { MarkerClusterer, Marker } from '@react-google-maps/api';
import { observer } from 'mobx-react';
import { useStores } from 'stores/index';
import { 	hover_Icon, colorCluster ,centerMap} from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import greenColorCar from './focosFinale.svg';
import FilterMarker from 'containers/Control/MainContainer/Map/filterdMarker';
import icon from '../../assets/icons/activeBussIcon copy.svg';
import { VehicleImagesChange } from 'containers/Control/MainContainer/Map/mapIcons';


const MapClustererFilter = ({ resourceList }) => {
	const [hoverIcon, setHoverIcon] = useRecoilState(hover_Icon);
	const { viewStore, resourceStore } = useStores();
	const [clickedOnSamePin, setClickedOnSamePin] = useState(false);
	const [opacityChange, setOpacityChange] = useState(false);
	const [centerMapResorce, setCenterMapResorce] = useRecoilState(centerMap);



	const clusterStyles = [
		{
			textColor: '#43496A',
			textSize: 10,
			textWeight: 'bold',
			url: greenColorCar,
			height: 50,
			width: 50,
			anchorText: [10, -5],
		},
	];

	return (
		<MarkerClusterer
	     	maxZoom={10}
			gridSize={30}
			minimumClusterSize={1}
			options={{
				imagePath:
					'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
				styles: clusterStyles,
			}}
		>
			{(clusterer) =>
				resourceList.length !== 0 &&
				resourceList.map(
					(data,index) =>
						data.in_focus === 1 && 
						(
							<FilterMarker data={data} key={index} clusterer={clusterer}/>
						),
				)
			}
		</MarkerClusterer>
	);
};
export default observer(MapClustererFilter);
