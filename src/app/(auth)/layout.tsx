export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div id="main-content" tabIndex={-1}>{children}</div>;
}
