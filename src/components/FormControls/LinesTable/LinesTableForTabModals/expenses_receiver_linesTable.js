import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';
// import { Select } from 'components/FormControls'; 
import Select from '../LinesTableComponents/Select/Select';
import Input from '../LinesTableComponents/Input/Input';
import Switch from '../../Switch/Switch';
//import Select from 'react-select'
import '../LinesTable.scss';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';


function Expenses_receiver_linesTable({table}) {
  const { t } = useTranslation();
  
  const [lines, setLines] = useState([
  {
    expenses_date:{label:"expenses_date",value:"", width:"50%"},
  expenses_reciver_name:{label:"expenses_reciver_name",value:"", width:"50%"},

 }
  ]);
  const [numOfLines, setNumOfLines] = useState(1);

//   const car_type_options = [
//     { value: 'bus', text: 'אוטובוס' },
//   { value: 'minibus', text: 'מיניבוס' },
//   { value: 'car', text: 'רכב' }
// ];
  const system_type_options=[
    { value: 'Protection', text: 'מיגון' },
    { value: 'terminal', text: 'מסופון' },
    { value: 'photography', text: 'צילום' },
    { value: 'Partitions', text: 'מחיצות' },
    { value: 'belts', text: 'חגורות' },
    { value: 'elevator', text: 'מעלית' },
    { value: 'safety', text: 'בטיחות' },
    { value: 'WiFi', text: 'WiFi' },
    { value: 'Ticketing', text: 'כירטוס' }
   
  ]
//   Protection, terminal,
// Ticketing, photography,
// Partitions, belts
// Safety, elevator


  const treshold_alert_type_options = [ { value: 'km', text: 'ק"\מ' },
  { value: 'numOfStations', text: 'כמות תחנות' },
  { value: 'time', text: 'זמן' }]

    const printLables = () => { 
      return Object.values(lines[0]).map((line)=>(
        <div 
        className='lable-text'
        key={line.label}
        style={{width:line.width}}>
          {/* {line.label} */}
          { t(`entity_form.vehicles_extra.table_lable.${line.label}`)}
        </div>
      ))
    }

    const creatNewLine = () => {
        setNumOfLines(numOfLines+1);
       let newLine= 
       {
        number:{label:"number",value:numOfLines+1, width:"10%"},
        system_type:{label:"system_type",value:"", width:"30%"},
        system_name:{label:"system_name", value:"", width:"30%"},
        system_code:{label:"system_code", value:"",width:"30%"},
      
       }
      setLines([...lines,newLine])

    }

    const removeLine = (index) => {
        let newLines = [...lines];
        let indexToRemove = Object.values(newLines).findIndex(line => line.number.value === index);
        //remove line from array
        newLines = newLines.slice(0,indexToRemove).concat(newLines.slice(indexToRemove+1));
        //setNumOfLines(numOfLines-1);
        setLines(newLines);
    }

    const setFieldValue = (index, field, value) => {
        let newLines = [...lines];
        //find index of line to change
        let indexToChange = Object.values(newLines).findIndex(line => line.number.value === index);
        //change value of field
        newLines[indexToChange][field].value = value;
        //let indexToChange = Object.values(newLines).findIndex(line => line.field === value);
        setLines(newLines);
    }
  return (
    <>
      {/* lables */}
   
    <div
      style={{display:'flex', flexDirection:'column',marginTop:'auto', width:"100%"}}>
           <div className='title-wrapper'> התקנות {numOfLines-1} </div>
    <br/>  
      
      <div className='lables-wrapper'>{printLables()}</div>

        {
            Object.values(lines).map((line,index)=>
            (
                <div
                className='row-data-wrapper'
                style={{display:'flex', flexDirection:'row',width: "max-content"}}
                key={index}>
                {/* number of line */}
                <div 
                //className='lable-text' 
                className='line-number-wrapper' style={{width:"10%"}}>
                    {line.number.value}
                </div>
                {/* select system_name */}
                <Select width={"30%"} label={"סוג מערכת"} field_name={"system_type"} index ={line.number.value} options={system_type_options} setFieldValue={setFieldValue}/>
                {/* input  system_code */}
                <Input  width={"30%"} field_name={"שם מערכת"}label={"system_name"} index ={line.number.value} setFieldValue={setFieldValue}/>
                {/* driver_price */}
                <Input width={"30%"} field_name={"קוד"} label={"system_code"}index ={line.number.value} setFieldValue={setFieldValue}/>
                {/* sub_contractor_price */}
                <RemoveCircleIcon fontSize="small" onClick={()=>removeLine(line.number.value)} 
                style={{marginTop:10, cursor:'pointer', visibility:line.number.value===1? "hidden":"visible"}}/>
            </div>  
            ))
        }
    </div>

    </>
  )
}

export default Expenses_receiver_linesTable