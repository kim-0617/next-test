import type { AppProps } from "next/app";
import "@/css/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app__wrap">
      <Component {...pageProps} />
    </div>
  );
}
