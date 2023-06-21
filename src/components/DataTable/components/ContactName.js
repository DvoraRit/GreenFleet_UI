import React,{useEffect,useState} from 'react'
import {_contactPeopleOfContract} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import Avatar from '@mui/material/Avatar';

function ContactName({row, dataTextStyle}) {
    const [contactPeopleOfContract, setContactPeopleOfContract] = useRecoilState(_contactPeopleOfContract);
    const [contactNameByRow, setContactNameByRow] = useState("");

    useEffect(() => {
        setContactNameByRow(contactPeopleOfContract
            .filter(x=>parseInt(x.contact_id)===parseInt(row?.original?.contact_person)));
    
    }, [contactPeopleOfContract,row?.original?.contact_person ])

    const getAvatarColors = () => {
        let colors = {
            primary: ['#2EC4B6', 'rgba(46,196,182,0.07)'],
            secondary: ['#6F85FF', 'rgba(111,133,255,0.07)'],
            natural: ['#43496A', 'rgba(67,73,106,0.07)'],
        };
    
        return colors.primary;
    };

    const stringAvatar = (name) => {
        let [color, bgOverly] = getAvatarColors();
        return {
            sx: {
                bgcolor: bgOverly,
                color: color,
                fontSize: 12,
                border: `1px solid ${color}`,
                height: 26,
                width: 26,
            },
            children: `${name?.split(' ')[0][0]}${name?.split(' ')?.[1]?.[0]}`,
        };
    };
    
  return (
    contactNameByRow.length >0
    ?
    <p
        style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
        }}
    >
        <div className='data-text' style={{ ...dataTextStyle }}>
            {`${contactNameByRow[0].first_name} ${contactNameByRow[0].last_name}`}
        </div>
        <Avatar size='small' {...stringAvatar(`${contactNameByRow[0].first_name} ${contactNameByRow[0].last_name}`)} />
    </p>
    :
    <div className='data-text' style={{ ...dataTextStyle }}>חסר איש קשר</div>
  )
}

export default ContactName