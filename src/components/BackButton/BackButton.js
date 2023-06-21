const BackButton = ({ children, className, ...rest }) => {
	return (
		<button className={`back-button ${className}`} {...rest}>
			{children}
		</button>
	);
};

export default BackButton;
