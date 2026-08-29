import { QueryClient, QueryClientProvider } from "@tanstack/preact-query";
import type { FunctionComponent } from "preact";

const queryClient = new QueryClient();

const withQuery = <P extends object>(
  Component: FunctionComponent<P>,
) => (props: P) => (
  <QueryClientProvider client={queryClient}>
    <Component {...props} />
  </QueryClientProvider>
);

export default withQuery;
