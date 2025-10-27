import "./globals.css";
import ClientWrapper from "@/redux-store/providers/ClientWrapper";

export const metadata = {
  title: "Talk2DB | Generate & Execute Queries with AI",
  description:
    "Talk2DB lets you generate and execute SQL or MongoDB queries instantly using natural language. Type your question, get the query, and run it — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
