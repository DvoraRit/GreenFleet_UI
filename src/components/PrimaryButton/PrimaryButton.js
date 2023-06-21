export function PrimaryButton({ children, className, disabled, ...rest }) {
	return (
		<button className={`primary-button ${className}`} disabled={disabled} {...rest}>
			{children}
		</button>
	);
}
