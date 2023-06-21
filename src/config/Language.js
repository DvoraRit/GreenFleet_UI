// import i18n from "i18n-js";
import LocalizedStrings from 'react-localization';
import ClientConfig from "./index";
const he = require('./language/he.json');
const en = require('./language/en.json');


// export const translate = (key, options) => {
//   return key ? i18n.t(key, options) : null;
// };


class Language {
    strings;
    _currentLanguage;

    constructor(languagesObject, defaultLang) {
        this.strings = new LocalizedStrings(languagesObject);

        this.currentLanguage = defaultLang;
        this.changeLanguage(defaultLang);
    }

    set currentLanguage(lang) {
        this._currentLanguage = lang;
    }

    get currentLanguage() {
        return this._currentLanguage;
    }

    get availableLanguages() {
        return this.strings.getAvailableLanguages();
    }

    /**
     * Gets a string key, returns the found language value -
     * If not found returns the key itself
     * @param key {string}
     * @param formatObjects {Array<any>} - array of formatting variables to be replaced in string
     * @return {string}
     */
    format(key, ...formatObjects) {
        let value;
        const item = this.strings[key];

        if (item) {
            value = item;

            if (formatObjects) {
                value = this.strings.formatString(item, formatObjects);
            }
        }

        return value || key;
    }

    /**
     * Accepts a string with pattern {key};{value1};{value2);...
     * To be translated to formatted string + values
     * @param str
     * @param delimiter
     */
    formatArgs(str, delimiter = ';') {
        // The first split argument should be key, the rest are values
        const [key, ...values] = str.split(delimiter);

        return this.format(key, values);
    }

    /**
     * Sets the language
     * @param language
     */
    changeLanguage(language) {
        this.currentLanguage = language;
        this.strings.setLanguage(language);
    }

}

const Lang = new Language({ he, en }, ClientConfig.defaultLanguage);


export default Lang;