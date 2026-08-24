import { QueryClient, QueryClientProvider } from "@tanstack/preact-query";
import type { FunctionComponent } from "preact";

const queryClient = new QueryClient();

const withQuery = (Component: FunctionComponent) => () => (
  <QueryClientProvider client={queryClient}>
    <Component />
  </QueryClientProvider>
);

export default withQuery;
