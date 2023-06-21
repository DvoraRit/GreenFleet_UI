import RedXIcon from 'assets/icons/RedXIcon.svg';
import GreenVIcon from 'assets/icons/GreenVIcon.svg';

const valuesDictionary = {
	0: {
		src: RedXIcon,
		alt: 'X',
	},
	1: {
		src: GreenVIcon,
		alt: 'V',
	},
};

const IsValueExistIcon = (props) => {
	const { value, ...rest } = props;
	const src = valuesDictionary[value].src;
	const alt = valuesDictionary[value].alt;
	return <img src={src} alt={alt} {...rest} />;
};

export default IsValueExistIcon;
