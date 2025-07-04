import React, { useState } from 'react';
import FurnitureCalculator from './components/FurnitureCalculator';
import SignageCalculator from './components/SignageCalculator';
import { LightbulbIcon, CubeIcon, SettingsIcon } from './components/Icons';
import useMaterials from './hooks/useMaterials';
import Modal from './components/Modal';
import MaterialsManager from './components/MaterialsManager';

type Tab = 'furniture' | 'signage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('furniture');
  const { materialsData, isLoading, error, refetch } = useMaterials();
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Đang tải dữ liệu vật tư...</div>;
    }
    if (error) {
      return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
    }
    if (!materialsData) {
        return <div className="text-center p-10">Không có dữ liệu vật tư.</div>;
    }

    switch (activeTab) {
      case 'furniture':
        return <FurnitureCalculator materials={materialsData.furniture} />;
      case 'signage':
        return <SignageCalculator materials={materialsData.signage} />;
      default:
        return <FurnitureCalculator materials={materialsData.furniture} />;
    }
  };

  const handleSaveManager = async () => {
    await refetch();
    setIsManagerOpen(false);
  }

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
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Công Cụ Tính Giá Thành Sản Phẩm</h1>
          <p className="mt-2 text-lg text-slate-600">
            Ước tính chi phí cho sản phẩm nội thất & bảng hiệu quảng cáo một cách chính xác.
          </p>
           <button 
            onClick={() => setIsManagerOpen(true)}
            className="absolute top-0 right-0 mt-1 flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg px-3 py-2"
            title="Quản lý Vật tư"
            >
                <SettingsIcon />
                <span className="hidden sm:inline">Quản lý Vật tư</span>
            </button>
        </header>

        <main>
          <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="grid grid-cols-2 gap-2">
              <TabButton tab="furniture" label="Nội Thất Gỗ" icon={<CubeIcon />} />
              <TabButton tab="signage" label="Bảng Hiệu" icon={<LightbulbIcon />} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[400px]">
            {renderContent()}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-sm text-slate-500">
            <p>Phát triển bởi chuyên gia React và Gemini API.</p>
            <p>Giao diện thiết kế với Tailwind CSS.</p>
        </footer>
      </div>
      {isManagerOpen && materialsData && (
        <Modal title="Quản lý Vật tư" onClose={() => setIsManagerOpen(false)}>
            <MaterialsManager currentData={materialsData} onSave={handleSaveManager} />
        </Modal>
      )}
    </div>
  );
};

export default App;
