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
    <header className="w-full relative z-50 md:block">
      <div className="mobile-header flex items-center justify-between md:justify-end h-14 md:h-auto px-4 md:px-10 py-2 bg-white/80 backdrop-blur-lg md:bg-transparent border-b md:border-0 border-gray-100">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">₹</span>
          </div>
          <span className="font-bold text-gray-800">Finance</span>
        </div>
        <div
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2 cursor-pointer mobile-card p-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          <p className="font-medium text-sm md:text-base hidden md:block">{user.full_name || user.name || 'User'}</p>
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
            <CircleUser className="w-5 h-5" />
          </div>
        </div>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-2 md:right-4 mt-2 w-48 md:w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in-mobile"
          >
            <div className="md:hidden px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-sm text-gray-800">{user.full_name || user.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => handleLogout()}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-left transition-colors rounded-b-xl"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
