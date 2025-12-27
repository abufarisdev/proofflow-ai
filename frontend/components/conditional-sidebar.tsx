
"use client"

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

const ConditionalSidebar = () => {
  const pathname = usePathname();
  const noSidebarRoutes = ['/landing'];

  if (noSidebarRoutes.includes(pathname)) {
    return null;
  }

  return <Sidebar />;
};

export default ConditionalSidebar;
