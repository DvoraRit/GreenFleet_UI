import React from 'react';
import Pin from '../../containers/Control/MainContainer/Map/Pin';
import { useRecoilState } from 'recoil';
import { setGrouping } from '../../recoil/atoms';

 const RenderMapLayerFinish = ({ resourcesLayer ,clusterer,map}) => {
	const [objChange, setObjChange] = useRecoilState(setGrouping);
    function createKey(location) {
        return location.lat + location.lng + location.id;
    }

	return (
		objChange.finish === true &&
		resourcesLayer.map((resource) => (
			<Pin
				key={createKey(resource)}
				data={resource}
				clusterer={clusterer}
				map={map}
			/>
		))
	);
};
export default RenderMapLayerFinish