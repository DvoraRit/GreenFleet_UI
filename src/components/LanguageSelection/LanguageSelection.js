import React, { useEffect, useState } from 'react'
import { MenuItem, Select } from '@material-ui/core';
import { lngChange } from '../../config/i18n';
import { useStores } from 'stores/index';
import { observer } from 'mobx-react';

const LanguageSelection = () => {
    const {languageStore} = useStores();
    const [selectedLang, setSelectedLang] = useState('');

    useEffect(() => {
        const language = languageStore.getLanguage();
        setSelectedLang(language);
        lngChange(language);
        languageStore.toggleLanguage();
    }, [])

    const handleLanguageChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if(value === selectedLang) {
            return;
        }
        languageStore.setLanguage(value);
        setSelectedLang(value);
        languageStore.toggleLanguage();
        lngChange(value);
    }

    return (
        <div className="select-language-container flex-center">
            <Select
                id="language"
                value={selectedLang}
                className="select-language"
                title={"Choose language"}
                onChange={handleLanguageChange}
                MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null
                  }}
            >
                <MenuItem value="he">He</MenuItem>
                <MenuItem value="en">En</MenuItem>
            </Select>
        </div>
    )
}

export default observer(LanguageSelection)
