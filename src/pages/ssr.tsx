import { CSSProperties } from "react";
import { trpc } from "../utils/trpc/trpc";
import { withTRPC } from "../utils/trpc/withTRPC";

function SSRPage() {
  const hello = trpc.useQuery(["hello", { text: "client" }]);
  console.log(hello);

  if (!hello.data) {
    return (
      <div style={styles}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={styles}>
      <h1>{hello.data.greeting}</h1>
      <p>
        <a href="/">Without SSR</a> | With SSR
      </p>
    </div>
  );
}

const styles: CSSProperties = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export default withTRPC({ ssr: true }, SSRPage);
