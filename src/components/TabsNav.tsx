
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabItem {
  label: string;
  path: string;
  value: string;
}

interface TabsNavProps {
  tabs: TabItem[];
  className?: string;
}

const TabsNav: React.FC<TabsNavProps> = ({
  tabs,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Find the current active tab based on the path
  const activeTab = tabs.find(tab => currentPath === tab.path)?.value || tabs[0].value;
  
  const handleTabChange = (value: string) => {
    const tabToNavigate = tabs.find(tab => tab.value === value);
    if (tabToNavigate) {
      navigate(tabToNavigate.path);
    }
  };
  
  return (
    <div className={`mb-6 ${className}`}>
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start bg-musinova-cream/30 p-1 rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-musinova-green data-[state=active]:shadow-sm rounded-md"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabsNav;
