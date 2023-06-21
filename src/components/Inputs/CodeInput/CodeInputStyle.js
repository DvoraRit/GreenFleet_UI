const baseCodeStyle = {
	MozAppearance: 'textfield',
};

const codeInputStyle = {
	inputStyle: {
		...baseCodeStyle,
	},
	inputStyleInvalid: {
		...baseCodeStyle,
		// TODO: use with formik, maybe change to scss
		borderColor: 'red',
	},
};

export default codeInputStyle;
