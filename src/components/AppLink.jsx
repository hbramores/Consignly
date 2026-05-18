import { cn } from "@/lib/utils";

function Link({ to, active, className, onNavigate, children, ...props }) {
  const href = to.startsWith("#") ? to : `#${to.replace(/^\/+/, "")}`;

  function handleClick(event) {
    event.preventDefault();
    const page = href.replace(/^#\/?/, "") || "dashboard";
    window.history.pushState(null, "", href);
    onNavigate?.(page);
  }

  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

export default Link;
