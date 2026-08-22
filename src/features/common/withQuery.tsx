import { QueryClient, QueryClientProvider } from "@tanstack/preact-query";

const queryClient = new QueryClient();

const withQuery = (Component) => () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Component />
		</QueryClientProvider>
	);
};

export default withQuery;
