export const transformForCreate = (values) => {
	let transformedValues = { ...values };
	Object.entries(values).forEach(([key, value]) => {
		if (Array.isArray(value) ) {
			transformedValues[key] = value.map(item => item.value).toString();	
		} else if (typeof value === 'object') {
			if (!!value?.value) {
				transformedValues[key] = value?.value;
			} else if (!!value?.base64) {
				transformedValues[key] = value?.base64;
			}
			else if (value?.value==="" || value?.value==null) {
				transformedValues[key] = null;
			}
			else if (typeof value?.value==='boolean') {
				if (value?.value) {
					transformedValues[key] = 1;
				} else {
					transformedValues[key] = 0;
				}
			}
		} else if (typeof value === 'boolean' ) {
			if (value) {
				transformedValues[key] = 1;
			} else {
				transformedValues[key] = 0;
			}
		}
		else{
			transformedValues[key] =value;
		}
	});


	return { ...transformedValues };
};

export const createPriceList = (values) => {
	let transformedValues = transformForCreate(values);
	let lines = [];
	if(values._lines?.length > 0) {
		//create new line
		values._lines?.forEach(async (line) => {
			lines.push({...transformForCreate(line),items_or_extra:"item",price_list_id:values.id});
			transformedValues["_lines"] = lines;
		});
	}
	if(values.extras?.length > 0) {
		//create new extra
		values.extras?.forEach((extra) => {
			lines.push({...transformForCreate(extra),items_or_extra:"extra",price_list_id:values.id});
			transformedValues["_lines"] = lines;
		});
	}
	if(values?.deleted?.length > 0) {
		transformedValues["deleted"] = values?.deleted;
	}
	else if (values.extras === undefined && values._lines === undefined) {
		transformedValues = {...transformedValues,_lines:[]}
	}
	if(values.id){
		return { ...transformedValues, price_list_id:values.id };
	}
	else{
		return { ...transformedValues, price_list_id:null };
	}
	
}

export const createContract = (values) => {
	let transformedValues = transformForCreate(values);
	let items=[];
	//add pricelistid insted of name
	values.items?.forEach((line) => {
		items.push({...transformForCreate(line),contract_id:values.id});
	});
	transformedValues["items"] = items;
	if(values?.deleted?.length > 0) {
		transformedValues["deleted"] = values?.deleted;
	}
	if(values.id){
		return { ...transformedValues, contract_id:values.id, contract_extra_array:items };
	}
	else{
		return { ...transformedValues, contract_id:null, contract_extra_array:items };
	}
}
export const createVehiclesTabs = (values ,spacialValues) => {
	let items=[];

	values?.forEach((line) => {
		let obj={
		"system_code":line.system_code.value,
		"system_name":line.system_name.value,
		"system_type":line.system_type.value,
		"vehicle_id":spacialValues,
	}

		items.push({...obj});
	});
	return items;

}

