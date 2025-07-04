import React, { useState } from 'react';
import FurnitureCalculator from './components/FurnitureCalculator';
import SignageCalculator from './components/SignageCalculator';
import { LightbulbIcon, CubeIcon } from './components/Icons';

type Tab = 'furniture' | 'signage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('furniture');

  const renderContent = () => {
    switch (activeTab) {
      case 'furniture':
        return <FurnitureCalculator />;
      case 'signage':
        return <SignageCalculator />;
      default:
        return <FurnitureCalculator />;
    }
  };

  const TabButton = ({ tab, label, icon }: { tab: Tab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center w-full px-4 py-3 font-semibold text-sm rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        activeTab === tab
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="ml-2.5">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Công Cụ Tính Giá Thành Sản Phẩm</h1>
          <p className="mt-2 text-lg text-slate-600">
            Ước tính chi phí cho sản phẩm nội thất & bảng hiệu quảng cáo một cách chính xác.
          </p>
        </header>

        <main>
          <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="grid grid-cols-2 gap-2">
              <TabButton tab="furniture" label="Nội Thất Gỗ" icon={<CubeIcon />} />
              <TabButton tab="signage" label="Bảng Hiệu" icon={<LightbulbIcon />} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {renderContent()}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-sm text-slate-500">
            <p>Phát triển bởi chuyên gia React và Gemini API.</p>
            <p>Giao diện thiết kế với Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;