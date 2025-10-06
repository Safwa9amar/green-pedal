import { ChargilyClient } from "@chargily/chargily-pay";

const MychargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_SECRET_KEY as string,
  mode: (process.env.CHARGILY_MODE as "test" | "live") || "test",
});

export default MychargilyClient;
