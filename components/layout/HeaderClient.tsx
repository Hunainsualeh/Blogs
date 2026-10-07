"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "@/config/navigation";
import { utilityNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { MenuData } from "@/types/navigation";
import { Button } from "@/components/ui/Button";
import { PenIcon, SearchIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MegaMenu } from "./MegaMenu";
import { MenuButton } from "./MenuButton";
import { MobileNavigation } from "./MobileNavigation";
import { SearchOverlay } from "./SearchOverlay";

type HeaderClientProps = {
  navigation: NavItem[];
  categories: NavItem[];
  menuData: MenuData;
};

export function HeaderClient({ navigation, categories, menuData }: HeaderClientProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen || window.matchMedia("(min-width: 1024px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 240 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${element.getBoundingClientRect().bottom}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const menuId = "site-menu";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 bg-white transition-[transform,box-shadow] duration-300",
          scrolled && "shadow-[0_1px_0_var(--theme-line),0_8px_24px_-20px_rgba(0,27,61,0.4)]",
          hidden && !menuOpen && !searchOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className={cn("container-site grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300", scrolled ? "h-14" : "h-16 sm:h-[72px]")}>
          <div className="flex items-center">
            <MenuButton open={menuOpen} onClick={() => setMenuOpen((value) => !value)} controls={menuId} />
          </div>
          <Logo />
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md px-2.5 text-ink-muted hover:bg-surface-muted hover:text-ink"
              aria-label="Search"
            >
              <SearchIcon size={19} />
              <span className="hidden text-[13px] font-medium xl:inline">Search</span>
              <kbd className="hidden rounded-sm border border-line px-1.5 font-mono text-[10px] text-ink-subtle xl:inline">⌘K</kbd>
            </button>
            <Button href={utilityNavigation.writeForUs.href} size="sm" className="hidden sm:inline-flex" icon={<PenIcon size={15} />} iconPosition="start">
              {utilityNavigation.writeForUs.label}
            </Button>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="container-site">
            <DesktopNavigation items={navigation} />
          </div>
        </div>
        {menuOpen ? (
          <>
            <MegaMenu id={menuId} categories={categories} data={menuData} onNavigate={closeMenu} />
            <MobileNavigation id={`${menuId}-mobile`} items={navigation} data={menuData} onNavigate={closeMenu} />
            <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] -z-10 hidden bg-[#00142b]/30 lg:block" onClick={closeMenu} aria-hidden />
          </>
        ) : null}
      </header>
      <SearchOverlay open={searchOpen} onClose={closeSearch} data={menuData} />
    </>
  );
}
