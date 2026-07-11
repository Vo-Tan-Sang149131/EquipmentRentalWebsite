import { type PropsWithChildren } from 'react';

export default function Sidebar({ children }: PropsWithChildren) {
  return (
    <aside
      className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r p-4"
    >
      {children}
    </aside>
  );
}
