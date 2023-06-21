import React, {useEffect, useState} from 'react'
import { useStores } from '../../stores/index';
import ResourcesService from '../../services/ResourcesService';

function TripsComments({resource}) {
    const {resourceStore} = useStores();
    const [trips, settrips] = useState([])
    useEffect(() => {
        ResourcesService.getTripsOfResource(resource.id).then((res)=>{
            settrips(res.filter(x=>x.comment));
        })
        .catch((error) => console.error('error', error));
    }, [])
    return (
        <div>
            {trips?.map((item, index)=>{
               return( 
               <div style={{disply:'flex', flexDirection:'row', justifyContent:'right'}} key={index}>
                    <div>{`${item.line_description}: `}</div>
                    <div>{item.comment}</div>
                </div>)    
            })}
        </div>
    )
}

export default TripsComments
