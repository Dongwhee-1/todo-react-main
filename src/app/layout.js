import "@/styles/globals.css";

export const metadata = {
  title: "Todo List of 'The One'",
  description: "Todo React App using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="p-0 m-0 font-courier bg-gray bg-cover bg-center bg-fixed">{children}</body>
    </html>
  );
}
