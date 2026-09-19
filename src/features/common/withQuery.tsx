import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FunctionComponent } from "react";

const queryClient = new QueryClient();

const withQuery = <P extends object>(
  Component: FunctionComponent<P>,
) => (props: P) => (
  <QueryClientProvider client={queryClient}>
    <Component {...props} />
  </QueryClientProvider>
);

export default withQuery;
