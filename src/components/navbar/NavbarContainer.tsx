import { ReactNode } from "react";

interface NavbarContainerProps {
  isScrolled: boolean;
  children: ReactNode;
}

export const NavbarContainer = ({ isScrolled, children }: NavbarContainerProps) => {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] ${
        isScrolled ? "bg-black/90 py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {children}
      </div>
    </nav>
  );
};
