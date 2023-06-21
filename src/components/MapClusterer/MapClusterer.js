import React, { useState, useEffect } from 'react';
import { MarkerClusterer } from '@react-google-maps/api';
import { useObserver, observer } from 'mobx-react';
import { useStores } from 'stores/index';
import { colorCluster ,setGrouping} from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import RenderMapLayerActive from '../controlLayers/renderMapLayerActive';
import RenderMapLayerExpected from '../controlLayers/renderMapLayerExpected';
import RenderMapLayerFinish from '../controlLayers/renderMapLayerFinish';
import RenderShowCarsWithNoTrips from '../controlLayers/renderShowCarsWithNoTrips';
import RenderShowCarsFromFillter from '../controlLayers/renderShowCarsFromFillter';
import RenderAllresources from '../controlLayers/renderAllresources';
import { ColorMapCluster } from './ColorMapCluster';
import greenColorCar from './focosFinale.svg';

import blueCar from './finale.svg';
import './MapClusterer.scss';

const MapClusterer = ({ resourceList ,map}) => {
	const [test, setTest] = useState(false);
	const [colorAllCluster, setColorAllCluster] = useRecoilState(colorCluster);
	const [objChange, setObjChange] = useRecoilState(setGrouping);


	const [icon, setIcon] = useState(false);
	const clusterStyles = [
		{
			textColor: '#43496A',
			textSize: 10,
			textWeight: 'bold',
			url: blueCar,
			height: 50,
			width: 50,
			anchorText: [15, 0],
		},
	];
	// const onClusteringBegin =(e )=>{
	// 	let checkStatusCluster=e.markers.filter((m)=>m.label!=='active')
		
	// 	if(checkStatusCluster.length>0){
	// 		console.log('Mouse 123 Over',e)
	// 		setColorAllCluster(colorAllCluster+1)
	// 		setTest(checkStatusCluster[1])
	// 	}

	// }

	return (
	<>
	{/* {	!test && */}
		<MarkerClusterer
			minimumClusterSize={2}
			options={{
				 imagePath:
				 	'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
				styles: clusterStyles,
				maxZoom:16,
			}}
			// onClusteringBegin={(e)=>onClusteringBegin(e)}
			// onMouseOver={(e)=>console.log('Mouse Over', e.markers.map((m)=>m.label))}
		>
			{/* here is the change of the map Layers */}
			{(clusterer) => (
				<>
	
					{resourceList.length !== 0 && (
						<RenderAllresources
							resourcesLayer={resourceList}
							clusterer={clusterer}
							map={map}
							setTest={setTest}
							test={test}
						/>
					)}
				</>
			)}
		</MarkerClusterer>
		{/* } */}
		</>
	);
};
export default observer(MapClusterer);