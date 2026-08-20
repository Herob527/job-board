const LoginForm = () => {
	const handleSubmit = (data: SubmitEvent) => {
		console.log(data);
	};
	return (
		<form method="POST" onSubmit={handleSubmit}>
			<input type="email" name="email" class="border border-amber-400" />
			<input type="password" name="password" class="border border-amber-400" />
			<button type="submit">Login</button>
		</form>
	);
};

export default LoginForm;
