import "./globals.css";

export const metadata = {
  title: "LUNATIC",
  description: "LUNATIC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="body">{children}</body>
    </html>
  );
}
