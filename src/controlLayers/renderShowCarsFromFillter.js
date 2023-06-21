import React from 'react';
import Pin from '../../containers/Control/MainContainer/Map/Pin';
import { useRecoilState } from 'recoil';
import { setGrouping } from '../../recoil/atoms';

 const RenderShowCarsFromFillter = ({ resourcesLayer ,clusterer}) => {
	const [objChange, setObjChange] = useRecoilState(setGrouping);
    function createKey(location) {
        return location.lat + location.lng + location.id;
    }

	return (
		resourcesLayer.map((resource) => (
			<Pin
				key={createKey(resource)}
				data={resource}
				clusterer={clusterer}
			/>
		))
	);
};
export default RenderShowCarsFromFillter