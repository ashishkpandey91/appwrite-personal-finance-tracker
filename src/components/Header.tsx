import { useAppSelector } from "@/store/hook";
import { handleLogout } from "@/utils/logout";
import { CircleUser, LogOut } from "lucide-react";
import React, { useEffect } from "react";

function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guard against undefined user
  if (!user) {
    return null;
  }

  return (
    <header className="w-full relative z-50">
      <div className="flex items-center justify-end h-full px-4 md:px-10 py-2 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 relative">
        <div
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <p className="font-semibold">{user.full_name || user.name || 'User'}</p>
          <div className="rounded-full w-8 h-8 flex items-center justify-center">
            <CircleUser />
          </div>
        </div>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-4 mt-2 w-40 bg-white rounded-md shadow-lg border z-50"
          >
            <button
              onClick={() => handleLogout()}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
