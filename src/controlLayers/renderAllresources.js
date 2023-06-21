import React , {useEffect } from 'react';
import Pin from '../../containers/Control/MainContainer/Map/Pin';
import { useRecoilState } from 'recoil';
import { setGrouping } from '../../recoil/atoms';

 const RenderAllresources = ({ resourcesLayer ,clusterer,map ,setTest,test}) => {
	const [objChange, setObjChange] = useRecoilState(setGrouping);
    function createKey(location) {
        return location?.lat + location?.lng + location?.id;
    }
    const isLayersOff=Object.values(objChange)
    .every(item => item === false)
	//DONT REMOVE THIS CODE!!!
	// useEffect(() => {
	// 	var clusters = clusterer.getClusters(); // use the get clusters method which returns an array of objects

	// 	let markersInClusters = [];
	// 	for( var i=0, l=clusters.length; i<l; i++ ){
	// 		for( var j=0, le=clusters[i]?.markers.length; j<le; j++ ){
	// 			 let marker = clusters[i].markers[j]; 
	// 			 markersInClusters.push({name: marker.label ,clustererID:i});
	// 			// console.log('markers123', marker.label)// <-- Here's your clustered marker
	// 		}
	// 	}
	// 	// console.log('markersInClusters', markersInClusters)
	// 	let aa=markersInClusters.filter((m)=>m.clustererID===0 )
	// 	setTest(markersInClusters)
	// 	console.log('markersIs', aa)

	// },[])

	return (
		resourcesLayer.map((resource, index) => (
			<Pin
				key={createKey(resource)}
				index={index}
				data={resource}
				clusterer={clusterer}
				map={map}
			/>
		))
	);
};
export default RenderAllresources