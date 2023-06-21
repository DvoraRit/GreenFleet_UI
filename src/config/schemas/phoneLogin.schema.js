import * as yup from 'yup';

const onlyNumbersRegex = (val) => /^[0-9]+$/i.test(val);

const messages = {
	required: 'זהו שדה חובה'
}

export const phoneLoginScheme = yup.object().shape({
	phoneNumber: yup
		.string()
		.required(messages.required)
		.test('phoneNumber', 'מספר הטלפון שהוזן אינו תקין', onlyNumbersRegex),
});

export const confirmationScheme = yup.object().shape({
	confirmationCode: yup
		.string()
		.required(messages.required)
		.test('confirmationCode', 'הקוד שהוזן אינו תקין', onlyNumbersRegex),
});
