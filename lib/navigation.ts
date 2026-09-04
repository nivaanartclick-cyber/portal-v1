'use client';

import { useRouter } from 'next/navigation';

export const ROUTES = {
  home: '/',
  services: '/services',
  portfolio: '/portfolio',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  'submit-project': '/submit-project',
  'request-revision': '/request-revision',
  admin: '/admin',
} as const;

export type PageId = keyof typeof ROUTES;

export function pageIdFromPath(pathname: string): PageId {
  if (pathname === '/') return 'home';
  const id = pathname.replace(/^\//, '') as PageId;
  return id in ROUTES ? id : 'home';
}

export function useAppRouter() {
  const router = useRouter();

  return {
    goTo(pageId: PageId) {
      router.push(ROUTES[pageId]);
    },
    goToSubmitWithService(serviceName: string) {
      router.push(`/submit-project?service=${encodeURIComponent(serviceName)}`);
    },
    goToServiceAnchor(serviceId: string) {
      router.push(`/services#${serviceId}`);
    },
    goToRevisionWithTicket(ticketId: string) {
      router.push(`/request-revision?ticket=${encodeURIComponent(ticketId)}`);
    },
  };
}
