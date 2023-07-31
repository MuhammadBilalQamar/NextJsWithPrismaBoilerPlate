import '@/styles/globals.scss';
// //theme
export default async function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
