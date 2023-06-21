const env = process.env.REACT_APP_ENV || 'dev';

export const AvailableLanguages = {
	he: 'he',
	en: 'en',
};
/**
 * Definitions of all environments config
 */
const LOCAL_SERVER = 'localhost';
// const LOCAL_NGROK = 'https://f065-77-125-241-216.ngrok.io';
const DEV_SERVER = '3.126.192.100';
const PREPROD_SERVER = '52.59.50.150';
const PROD_SERVER = '18.157.82.193';

const local = {
	// apiBaseHost: `http://${LOCAL_SERVER}:5000/api`,
	//apiBaseHost: `http://localhost:4000/api/v1`,~
	apiBaseHost: `http://${LOCAL_SERVER}:5000/api/v1/`,
};
const dev = {
	apiBaseHost: `http://${DEV_SERVER}:5000/api/v1/`,
};
const preprod = {
	apiBaseHost: `http://${PREPROD_SERVER}:5000/api/v1/`,
};
const prod = {
	apiBaseHost: `http://${PROD_SERVER}:5000/api/v1/`,
};
// const planner = {
// 	apiBaseHost: `http://${PROD_SERVER}:5000/planner/v1/`,
// };

const envConfigs = {
	local,
	dev,
	preprod,
	prod,
	// planner
};

/**
 * Generate config according to env
 */
const ClientConfig = {
	mapsApiKey: 'AIzaSyBFuDLMINZot5gFc0brTb_toEAk-bSVqVQ', // if you want to change api key, you need to change this also in index.html
	defaultLanguage: AvailableLanguages.en,

	// Get all environment configurations
	...envConfigs[env],
};

export default ClientConfig;
