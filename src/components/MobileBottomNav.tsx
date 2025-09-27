import { Card } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  Home,
} from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
}: MobileBottomNavProps) => {
  const tabs = [
    { id: "overview", label: "Home", icon: Home },
    { id: "transactions", label: "History", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <Card className="bg-white/95 backdrop-blur-sm border-t border-gray-200 rounded-none shadow-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mb-1 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
