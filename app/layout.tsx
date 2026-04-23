// Root layout — pass-through. The [locale]/layout.tsx handles html/body/providers.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
