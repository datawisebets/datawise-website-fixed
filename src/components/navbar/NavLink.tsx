
import { Link } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  // Use Link for routes and 'a' for anchors
  if (href.startsWith('/')) {
    return <Link to={href} className={className} onClick={onClick}>{children}</Link>;
  } else {
    return <a href={href} className={className} onClick={onClick}>{children}</a>;
  }
};
