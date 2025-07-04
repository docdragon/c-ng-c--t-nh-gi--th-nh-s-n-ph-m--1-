import React, { useState } from 'react';
import type { AllMaterials, MaterialItem } from '../types';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface MaterialsManagerProps {
  currentData: AllMaterials;
  onSave: () => Promise<void>;
}

type Category = keyof AllMaterials;

const MaterialsManager: React.FC<MaterialsManagerProps> = ({ currentData, onSave }) => {
  const [data, setData] = useState<AllMaterials>(JSON.parse(JSON.stringify(currentData))); // Deep copy
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = <C extends Category>(category: C, subCategory: keyof AllMaterials[C], index: number, field: 'name' | 'price', value: string | number) => {
    const newData = { ...data };
    const items = (newData[category] as any)[subCategory] as MaterialItem[];
    if (field === 'price') {
      items[index][field] = Number(value);
    } else {
      items[index][field] = value as string;
    }
    setData(newData);
  };

  const handleAddItem = <C extends Category>(category: C, subCategory: keyof AllMaterials[C]) => {
    const newData = { ...data };
    const items = (newData[category] as any)[subCategory] as MaterialItem[];
    items.push({ name: 'Vật tư mới', price: 0 });
    setData(newData);
  };

  const handleRemoveItem = <C extends Category>(category: C, subCategory: keyof AllMaterials[C], index: number) => {
    const newData = { ...data };
    const items = (newData[category] as any)[subCategory] as MaterialItem[];
    items.splice(index, 1);
    setData(newData);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Không thể lưu dữ liệu. Vui lòng thử lại.');
      }
      await onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = <C extends Category>(title: string, category: C, subCategory: keyof AllMaterials[C]) => {
    const items = (data[category] as any)[subCategory] as MaterialItem[];
    return (
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-x-3 items-center">
              <div className="col-span-6">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(category, subCategory, index, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Tên vật tư"
                />
              </div>
              <div className="col-span-5">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(category, subCategory, index, 'price', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Đơn giá"
                />
              </div>
              <div className="col-span-1">
                <button onClick={() => handleRemoveItem(category, subCategory, index)} className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Xóa">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => handleAddItem(category, subCategory)} className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center transition-colors">
          <PlusCircleIcon className="mr-1" /> Thêm
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex-1 space-y-8">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800">Nội thất gỗ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {renderSection('Ván công nghiệp (/m²)', 'furniture', 'materials')}
                    {renderSection('Bề mặt hoàn thiện (/m²)', 'furniture', 'finishes')}
                    {renderSection('Phụ kiện (cái/bộ)', 'furniture', 'hardware')}
                </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-bold text-green-800">Bảng hiệu quảng cáo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {renderSection('Vật liệu khung (/m)', 'signage', 'frames')}
                    {renderSection('Vật liệu mặt (/m²)', 'signage', 'faces')}
                </div>
            </div>
        </div>
        <footer className="pt-6 mt-6 border-t border-slate-200 sticky bottom-0 bg-white pb-1">
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
            >
                {isLoading ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
            </button>
        </footer>
    </div>
  );
};

export default MaterialsManager;