import { useState, useEffect } from "react";
import {
  CreditCard,
  TrendingUp,
  Home,
  Plus,
  ListTodo,
} from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction?: () => void;
}

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
  onAddTransaction,
}: MobileBottomNavProps) => {
  const [isPressed, setIsPressed] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "Home", icon: Home },
    { id: "transactions", label: "History", icon: CreditCard },
    { id: "todos", label: "Todos", icon: ListTodo },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <>
      {/* Floating Action Button */}
      {onAddTransaction && (
        <button
          onClick={onAddTransaction}
          className="fab bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all md:hidden"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '16px',
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            zIndex: 40,
          }}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="mobile-bottom-nav bg-white/98 backdrop-blur-xl border-t border-gray-100">
          <div className="flex items-center justify-around h-14">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsPressed(tab.id);
                    setTimeout(() => setIsPressed(null), 150);
                  }}
                  className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                    isPressed === tab.id ? "scale-95" : ""
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  )}

                  <div className={`relative ${isActive ? "transform -translate-y-0.5" : ""}`}>
                    <Icon
                      className={`h-5 w-5 transition-all duration-200 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full scale-150" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-medium mt-1 transition-all duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Ripple effect on tap */}
                  {isPressed === tab.id && (
                    <div className="absolute inset-0 bg-gray-100 opacity-30 rounded-lg animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
