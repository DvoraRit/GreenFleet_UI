import React,{useEffect,useState} from 'react'
import {_pricesListForContract} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
function PricesListContract({dataTextStyle, row}) {

	const [pricesListForContract, setPricesList] = useRecoilState(_pricesListForContract);

	const [pricesListForRow, setPricesListForRow] = useState([]);	
	
	useEffect(() => {
		let price_list = pricesListForContract?.filter(x=>parseInt(x.contract_id)===parseInt(row?.original?.id));
		setPricesListForRow(price_list);

	}, [pricesListForContract,row?.original?.id ])
	

  return (
	  
	pricesListForRow?.map((item)=>{
			return (
				<span className='data-text' style={{ ...dataTextStyle }}>
					{`${item.price_list_name},`}
				</span>
			);
		})
		
	  
  )
}

export default PricesListContract