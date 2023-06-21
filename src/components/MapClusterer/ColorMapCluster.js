import React,{useEffect} from 'react';
import svgConvertCluster from '../../containers/Control/MainContainer/Map/svgConvert/svgConvertCluster';
import svgConvertFocusCluster from '../../containers/Control/MainContainer/Map/svgConvert/focosClaster' ;
import iconCluster from './finale.svg';
import focos from './focosFinale.svg';
export const ColorMapCluster = (data) => {
	// const itemsInFocus = data.filter((resource) => resource.in_focus !== 0);
	// const itemsColored = data.filter((resource) => data.color==='#1B0D3D');
	// const ColorIconCluster =
	// 	'data:image/svg+xml;charset=utf-8,' +
	// 	encodeURIComponent(svgConvertCluster(data.color, data));
	// const ColorFocusIconCluster =
	// 	'data:image/svg+xml;charset=utf-8,' +
	// 	encodeURIComponent(svgConvertFocusCluster('#2EC4B6', data));


useEffect(() => {},[data])
	let icon;
    switch (data) {
        case data.length > 0:
            icon = focos;
          break;
        // case itemsInFocus.length < 0:
        //     icon = focos;
        //   break;
        default:
            icon = iconCluster;
      }
	// if (itemsInFocus.length > 0) {
 
	// 	icon = ColorFocusIconCluster;
	// }
	// if (itemsColored.length > 0) {
	// 	icon = ColorIconCluster;
	// }
    // if(itemsColored.length <= 0 && itemsInFocus.length <= 0){
    //     icon=ColorIconCluster;

    // }
	return icon;
};
