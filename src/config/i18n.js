import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { changeAppDirection } from 'utils/chnageAppDirection';
const he = require('./language/he.json');
const en = require('./language/en.json');

const defaultLanguage = 'he';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: false,
		fallbackLng: 'en',
		lng: defaultLanguage,
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: {
				translation: {
					...en,
				},
			},
			he: {
				translation: {
					...he,
				},
			},
		},
		react: {
			// bindI18n: 'languageChanged',
			// bindI18nStore: '',
			// transEmptyNodeValue: '',
			// transSupportBasicHtmlNodes: true,
			// transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
			// useSuspense: true,
		},
	});

export const lngChange = (lng = '') => {
	if (lng) {
		i18n.changeLanguage(lng);
	}
	const dir = i18n.dir();
	changeAppDirection(dir);
};

export default i18n;
