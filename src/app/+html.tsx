import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="hr">
      <head>
        <meta charSet="utf-8" />
        <meta
          httpEquiv="X-UA-Compatible"
          content="IE=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>FSRE App</title>
        <meta
          name="description"
          content="Službena mobilna aplikacija Fakulteta strojarstva, računarstva i elektrotehnike za studente."
        />
        <meta
          name="theme-color"
          content="#1e5a8a"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
