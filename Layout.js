// frontend/pages/components/Layout.js

import Navbar from './Navbar';

export default function Layout({ role, children }) {
  return (
    <>
      <Navbar role={role} />
      <main className="p-4">{children}</main>
    </>
  );
}
