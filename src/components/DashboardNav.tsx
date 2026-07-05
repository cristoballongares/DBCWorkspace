'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { Role } from '@prisma/client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, BookOpen, Trophy, Dumbbell, Tags, Users, Key, LogOut } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const { setOpen, open } = useSidebar();

  const items: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/problems', label: 'Problemas', icon: BookOpen },
    { href: '/contests', label: 'Contests', icon: Trophy },
    { href: '/training', label: 'Entrenamiento', icon: Dumbbell },
    { href: '/topics', label: 'Temas', icon: Tags },
    { href: '/team', label: 'Equipo', icon: Users },
  ];

  if (role === 'ADMIN') {
    items.push({ href: '/admin/invitations', label: 'Invitaciones', icon: Key });
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border-default bg-bg-base">
      <SidebarHeader className="pt-4 pb-2 px-4 flex items-center h-16">
        {open ? (
          <span className="text-sm font-semibold tracking-wider text-text-primary uppercase">DBCWorkspace</span>
        ) : (
          <span className="text-sm font-bold text-text-primary">DW</span>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted text-xs">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full block">
                      <SidebarMenuButton 
                        isActive={isActive} 
                        tooltip={!open ? item.label : undefined}
                        className={isActive ? 'bg-bg-elevated text-link-focus font-medium' : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors'}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border-default p-2">
        <ThemeSwitcher />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut({ callbackUrl: '/login' })}
              tooltip="Cerrar sesión"
              className="text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
