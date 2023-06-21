import React, {useState,useEffect} from 'react'
import { useTranslation } from 'react-i18next';
// import { Select } from 'components/FormControls'; 
import Select from './LinesTableComponents/Select/Select';
import Input from './LinesTableComponents/Input/Input';
import SwitchForTable from './LinesTableComponents/Switch/SwitchForTable';
//import SwitchForTable from './Switch/SwitchForTable';
//import Select from 'react-select'
import './LinesTable.scss';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import { Formik } from 'formik';


function LinesTable({onChange,initialValues}) {
  const { t } = useTranslation();
	const [deleted, setDeleted] = useState([])
  const [lines, setLines] = useState([	
	  {
		id:{label:"id",value:null, width:"0%"},
		number:{label:"number",value:1, width:"4.5%"},
		line_name:{label:"line_name",value:null, width:"17%"},
		tag:{label:"tag", value:null, width:"4%"},
		treshold_alert_type:{label:"treshold_alert_type", value:null,width:"14%"},
		treshold_alert_limit:{label:"treshold_alert_limit",value:null,width:"15%"},
		car_type:{label:"car_type",value:null,width:"13%"}, 
		customer_price:{label:"customer_price", value:null,width:"14%"},
		driver_price:{label:"driver_price",value:null,width:"14%"},
		sub_contractor_price:{label:"sub_contractor_price",value:null,width:"13%"},
		auto_reports:{label:"auto_reports",value:false,width:"8%"} }]);
  const [numOfLines, setNumOfLines] = useState(lines.length);

  const car_type_options = ['large', 'medium','small','extraSmall'];
  const treshold_alert_type_options = ["none",'km', 'numOfStations','time'];
  useEffect(() => {

	  if(initialValues && initialValues._lines?.length > 0){
		  let newLines =  [];
		  initialValues?._lines?.forEach(element => {
			  let obj =JSON.parse(JSON.stringify(lines[0]));
				Object.values(obj).forEach(item=>{
					item.value=element[item.label];
				});
		  	newLines.push(obj);
		  });
		setLines(newLines);
	  }
	  
  }, [initialValues])

    const printLables = () => { 
      return Object.values(lines[0]).filter(x=>x.label!=="id").map((line)=>(
        <div 
        className='lable-text'
        key={line.label}
        style={{width:line.width, marginLeft:line.label==="auto_reports"? "21px":0}}>
          { t(`entity_form.price_extra.table_lable.${line.label}`)}
        </div>
      ))
    }
    
    const creatNewLine = () => {
        setNumOfLines(lines.length+1);
		let newLine =JSON.parse(JSON.stringify(lines[0]));
		//reset values to ""
		Object.values(newLine).forEach(item=>{
			item.value=null
		});
		newLine.number.value = lines.length+1;
      setLines([...lines,newLine]);
    }

    const removeLine = (index) => {
        let newLines = [...lines];
        let indexToRemove = Object.values(newLines).findIndex(line => line.number.value === index);
        //remove line from array
        newLines = newLines.slice(0,indexToRemove).concat(newLines.slice(indexToRemove+1));
        //setNumOfLines(numOfLines-1);
        setLines(newLines);
		//if id.value is not null, add to deleted array
		if(lines[indexToRemove].id.value){
			setDeleted([...deleted,lines[indexToRemove].id.value]);
			onChange({lines:[...newLines], deleted:[...deleted,lines[indexToRemove].id.value]});
		}
    }

    const setFieldValue = (index, field, value) => {
        let newLines = [...lines];
        //find index of line to change
        let indexToChange = Object.values(newLines).findIndex(line => line.number.value === index);
        //change value of field
        newLines[indexToChange][field].value = value;
        //let indexToChange = Object.values(newLines).findIndex(line => line.field === value);
        setLines(newLines);
        onChange({lines:newLines.map(x=>{return ({...x,items_or_extra:"item"})})});
    }

	const getLabel = (line,field_name ) =>{
		if(line[field_name].value!==null){
			return line[field_name].value
		}
		else{
			return t(`entity_form.price_extra.table_lable.${line[field_name].label}`)
		}
	}

	function LineItem(_line) {
		let line = _line._line;
		return ( line &&
			<div
						className='row-data-wrapper'
						style={{ display: 'flex', flexDirection: 'row' }}
					>
						{/* number of line */}
						<div
							//className='lable-text'
							className='line-number-wrapper'
							style={{ width: '5%' }}
						>
							{line.number?.value}
						</div>
						<Input
							width={'20%'}
							label = {getLabel(line,'line_name')}
							field_name={'line_name'}
							table_name={"price_extra"}
							index={line.number?.value}
							setFieldValue={setFieldValue}
						/>
						{/* name of line */}
						<Input
							width={'5%'}
							label = {getLabel(line,'tag')}
							field_name={'tag'}
							table_name={"price_extra"}
							index={line.number?.value}
							setFieldValue={setFieldValue}
							clearLablelOnClick={false}
						/>
						{/* select treshold_alert_type */}
						<Select
							width={'15%'}
             				table_name ={"price_extra"}
							label={line.treshold_alert_type?.value ? t(`entity_form.price_extra.select.${line.treshold_alert_type?.value}`) : t(`entity_form.price_extra.select.${line.treshold_alert_type?.label}`)}
							field_name={'treshold_alert_type'}
							index={line.number?.value}
							options={treshold_alert_type_options}
							setFieldValue={setFieldValue}
						/>
						{/* input treshold_alert quantity */}
						<Input
							width={'15%'}
							label={getLabel(line,"treshold_alert_limit")}
							//label={line.treshold_alert_limit.value?line.treshold_alert_limit.value :'quantity'}
							field_name={'treshold_alert_limit'}
							table_name={"price_extra"}
							index={line.number?.value}
							setFieldValue={setFieldValue}
						/>
						{/* select car type */}
						<Select
						 	//label = {getLabel(line,"car_type")}
							label={line.car_type.value? t(`entity_form.price_extra.select.${line.car_type?.value}`) : t(`entity_form.price_extra.select.${line.car_type?.label}`)}
							width={'15%'}
              				table_name ={"price_extra"}
							index={line.number.value}
							field_name={'car_type'}
							options={car_type_options}
							setFieldValue={setFieldValue}
						/>
						{/* customer_price */}
						<Input
							width={'15%'}
							label = {getLabel(line,'customer_price')}
							//label={line.customer_price.value ? line.customer_price.value : 'customer_price'}
							field_name={'customer_price'}
							index={line.number?.value}
							table_name={"price_extra"}
							setFieldValue={setFieldValue}
							addSymbol={"cost"}
						/>
						{/* driver_price */}
						<Input
							width={'15%'}
							label = {getLabel(line,'driver_price')}
							//label={line.driver_price.value ? line.driver_price.value :'driver_price'}
							field_name={'driver_price'}
							index={line.number?.value}
							table_name={"price_extra"}
							setFieldValue={setFieldValue}
							addSymbol={"cost"}
						/>
						{/* sub_contractor_price */}
						<Input
							width={'15%'}
							label = {getLabel(line,'sub_contractor_price')}
							//label={line.sub_contractor_price.value ? line.sub_contractor_price.value :'sub_contractor_price'}
							field_name={'sub_contractor_price'}
							index={line.number?.value}
							table_name={"price_extra"}
							setFieldValue={setFieldValue}
							addSymbol={"cost"}
						/>
						<div className='switch-wrapper'>
						<SwitchForTable 
							label={''} 
							value={line.auto_reports?.value===1} 
							setFieldValue={setFieldValue} 	
							index={line.number?.value}
							field_name={'auto_reports'}
                		/>
						</div>
						<RemoveCircleIcon
							fontSize='small'
							onClick={() => removeLine(line.number.value)}
							style={{
								marginTop: 10,
								cursor: 'pointer',
								visibility: line.number.value === 1 ? 'hidden' : 'visible',
							}}
						/>
			</div>
			)
	}

  return (
		<>
	<Formik>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: 10,
					width: '100%',
				}}
			>
				<div className='lables-wrapper'>{printLables()}</div>

				{Object.values(lines).map((line) => (
					<LineItem key={line?.line?.number?.value} _line={line} />
				))}

				<div className='add-button-wrapper' onClick={creatNewLine}>
					<AddIcon
						fontSize='small'
						sx={{ color: '#2EC4B6', marginLeft: '5px' }}
					/>
					<div>הוסף פריט</div>
				</div>
			</div>
      </Formik>
		</>
	);
}

export default LinesTable