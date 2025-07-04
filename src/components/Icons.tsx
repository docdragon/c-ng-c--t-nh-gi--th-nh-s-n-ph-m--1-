import React, { useState, useMemo, useCallback } from 'react';
import type { FurnitureParams, CostBreakdown, CostItem } from '../types';
import AiSuggester from './AiSuggester';
import CostResult from './CostResult';
import { getFurnitureSuggestions } from '../services/geminiService';
import { CubeIcon, PlusCircleIcon, TrashIcon } from './Icons';

// Kích thước tấm ván tiêu chuẩn (mm) và diện tích (m²)
const STANDARD_PANEL_WIDTH = 1220;
const STANDARD_PANEL_HEIGHT = 2440;
const PANEL_AREA_M2 = (STANDARD_PANEL_WIDTH * STANDARD_PANEL_HEIGHT) / 1000000;

const MATERIALS = {
  'MDF': 150000,
  'MDF Chống Ẩm': 200000,
  'HDF': 250000,
  'Ván ép': 180000,
  'MFC': 140000
};

const FINISHES = {
  'Sơn PU': 120000,
  'Phủ Melamine': 80000,
  'Phủ Laminate': 300000,
  'Phủ Acrylic': 500000,
  'Phủ Veneer': 250000
};

const HARDWARE_PRICES = {
    'Bản lề': 15000,
    'Ray trượt': 50000,
    'Tay nắm': 25000,
    'Khóa': 40000
};


const FurnitureCalculator: React.FC = () => {
  const [params, setParams] = useState<FurnitureParams>({
    name: '',
    length: 1200,
    width: 600,
    height: 800,
    material: 'MDF Chống Ẩm',
    materialPrice: MATERIALS['MDF Chống Ẩm'],
    finish: 'Phủ Melamine',
    finishPrice: FINISHES['Phủ Melamine'],
    hardware: [{ name: 'Bản lề', quantity: 4, price: HARDWARE_PRICES['Bản lề'] }],
    laborHours: 8,
    laborRate: 50000,
    profitMargin: 25,
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleParamChange = (field: keyof FurnitureParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleHardwareChange = (index: number, field: 'name' | 'quantity' | 'price', value: string | number) => {
      const newHardware = [...params.hardware];
      const currentItem = { ...newHardware[index] };
      
      if (field === 'name' && typeof value === 'string') {
          currentItem.name = value;
          currentItem.price = HARDWARE_PRICES[value as keyof typeof HARDWARE_PRICES] || 0;
      } else if (field === 'quantity') {
          currentItem.quantity = Number(value) || 0;
      } else if (field === 'price') {
          currentItem.price = Number(value) || 0;
      }
      
      newHardware[index] = currentItem;
      handleParamChange('hardware', newHardware);
  };
  
  const addHardware = () => {
      const newHardware = [...params.hardware, { name: 'Tay nắm', quantity: 1, price: HARDWARE_PRICES['Tay nắm'] }];
      handleParamChange('hardware', newHardware);
  };

  const removeHardware = (index: number) => {
      const newHardware = params.hardware.filter((_, i) => i !== index);
      handleParamChange('hardware', newHardware);
  };
  
  const handleAiSuggest = useCallback(async (prompt: string) => {
      setIsAiLoading(true);
      const suggestions = await getFurnitureSuggestions(prompt);
      if (suggestions) {
          setParams(prev => ({
              ...prev,
              name: suggestions.productName,
              length: suggestions.dimensions.length,
              width: suggestions.dimensions.width,
              height: suggestions.dimensions.height,
              material: suggestions.material,
              materialPrice: MATERIALS[suggestions.material as keyof typeof MATERIALS] || prev.materialPrice,
              finish: suggestions.finish,
              finishPrice: FINISHES[suggestions.finish as keyof typeof FINISHES] || prev.finishPrice,
              hardware: suggestions.hardware.map(h => ({
                  ...h,
                  price: HARDWARE_PRICES[h.name as keyof typeof HARDWARE_PRICES] || 0
              }))
          }));
      }
      setIsAiLoading(false);
  }, []);

  const costBreakdown: CostBreakdown = useMemo(() => {
    // 1. Tính diện tích bề mặt (diện tích net) của sản phẩm hoàn thiện.
    const surfaceAreaM2 = ((params.length * params.width) + (params.length * params.height) + (params.width * params.height)) * 2 / 1000000;

    // 2. Ước tính tổng diện tích vật liệu thô cần dùng (diện tích gross), bao gồm cả hao hụt khi cắt.
    // Đây là một giả định đơn giản hóa, thực tế phụ thuộc vào thuật toán xếp tấm. 1.8x là một hệ số phổ biến.
    const grossMaterialAreaM2 = surfaceAreaM2 * 1.8;

    // 3. Từ diện tích thô, tính toán số lượng tấm ván tiêu chuẩn cần mua. Luôn làm tròn lên.
    const panelCount = Math.ceil(grossMaterialAreaM2 / PANEL_AREA_M2);

    // 4. Chi phí ván được tính dựa trên việc mua NGUYÊN TẤM.
    const woodPanelsCost = panelCount * PANEL_AREA_M2 * params.materialPrice;
    
    // 5. Chi phí hoàn thiện bề mặt chỉ tính trên diện tích net của sản phẩm.
    const finishCost = surfaceAreaM2 * params.finishPrice;

    const totalMaterialCost: CostItem = {
        name: 'Chi phí vật tư',
        value: woodPanelsCost + finishCost,
        details: `${panelCount} tấm ván + ${surfaceAreaM2.toFixed(2)}m² bề mặt`
    };

    const hardwareCostValue = params.hardware.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const hardwareCost: CostItem = { name: 'Chi phí phụ kiện', value: hardwareCostValue, details: `${params.hardware.length} loại` };

    const laborCost: CostItem = { name: 'Chi phí nhân công', value: params.laborHours * params.laborRate, details: `${params.laborHours} giờ` };

    const subTotal = totalMaterialCost.value + hardwareCost.value + laborCost.value;
    const profit = subTotal * (params.profitMargin / 100);
    const finalPrice = subTotal + profit;

    return {
      materialCost: totalMaterialCost,
      hardwareCost,
      laborCost,
      totalCost: subTotal,
      profitMargin: profit,
      finalPrice,
    };
  }, [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6">
        <AiSuggester onSuggest={handleAiSuggest} isLoading={isAiLoading} placeholder="VD: tủ bếp dưới 2 cánh, 1 ngăn kéo..." />
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center"><CubeIcon className="mr-2"/>Thông số sản phẩm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Dài (mm)" type="number" value={params.length} onChange={e => handleParamChange('length', Number(e.target.value))} />
            <InputField label="Rộng (mm)" type="number" value={params.width} onChange={e => handleParamChange('width', Number(e.target.value))} />
            <InputField label="Cao (mm)" type="number" value={params.height} onChange={e => handleParamChange('height', Number(e.target.value))} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Vật liệu & Hoàn thiện</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Vật liệu ván" value={params.material} onChange={e => { const val = e.target.value; handleParamChange('material', val); handleParamChange('materialPrice', MATERIALS[val as keyof typeof MATERIALS] || 0); }} options={Object.keys(MATERIALS)} />
              <InputField label="Đơn giá ván (/m²)" type="number" value={params.materialPrice} onChange={e => handleParamChange('materialPrice', Number(e.target.value))} />
              <SelectField label="Bề mặt hoàn thiện" value={params.finish} onChange={e => { const val = e.target.value; handleParamChange('finish', val); handleParamChange('finishPrice', FINISHES[val as keyof typeof FINISHES] || 0); }} options={Object.keys(FINISHES)} />
              <InputField label="Đơn giá hoàn thiện (/m²)" type="number" value={params.finishPrice} onChange={e => handleParamChange('finishPrice', Number(e.target.value))} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Phụ kiện</h3>
          <div className="space-y-3">
              {params.hardware.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5"><SelectField label="" value={item.name} onChange={e => handleHardwareChange(index, 'name', e.target.value)} options={Object.keys(HARDWARE_PRICES)} /></div>
                      <div className="col-span-3"><InputField label="" type="number" value={item.quantity} onChange={e => handleHardwareChange(index, 'quantity', e.target.value)} /></div>
                      <div className="col-span-3"><InputField label="" type="number" value={item.price} onChange={e => handleHardwareChange(index, 'price', e.target.value)} /></div>
                      <div className="col-span-1"><button onClick={() => removeHardware(index)} className="text-slate-400 hover:text-red-500 transition-colors"><TrashIcon /></button></div>
                  </div>
              ))}
          </div>
          <button onClick={addHardware} className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center transition-colors">
            <PlusCircleIcon className="mr-1" /> Thêm phụ kiện
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Chi phí khác</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Giờ công (h)" type="number" value={params.laborHours} onChange={e => handleParamChange('laborHours', Number(e.target.value))} />
            <InputField label="Đơn giá công (/h)" type="number" value={params.laborRate} onChange={e => handleParamChange('laborRate', Number(e.target.value))} />
            <InputField label="Lợi nhuận (%)" type="number" value={params.profitMargin} onChange={e => handleParamChange('profitMargin', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="lg:sticky top-8 self-start">
        <CostResult breakdown={costBreakdown} productName={params.name || "Sản phẩm nội thất"} />
      </div>
    </div>
  );
};


const InputField = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);

const SelectField = ({ label, options, ...props }: { label: string, options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
        {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
        <select {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default FurnitureCalculator;