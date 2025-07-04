import React, { useState, useMemo } from 'react';
import type { SignageParams, CostBreakdown, CostItem } from '../types';
import CostResult from './CostResult';
import { LightbulbIcon } from './Icons';

const SIGN_TYPES = ['Hộp đèn', 'Chữ nổi', 'Bảng Alu', 'Bảng LED'];
const FRAME_MATERIALS = { 'Sắt': 50000, 'Nhôm': 80000, 'Inox': 120000 };
const FACE_MATERIALS = { 'Mica': 400000, 'Alu': 350000, 'Bạt Hiflex': 80000 };

const SignageCalculator: React.FC = () => {
    const [params, setParams] = useState<SignageParams>({
        name: 'Bảng hiệu công ty',
        width: 3,
        height: 1.2,
        signType: 'Hộp đèn',
        frameMaterial: 'Nhôm',
        framePrice: FRAME_MATERIALS['Nhôm'],
        faceMaterial: 'Mica',
        facePrice: FACE_MATERIALS['Mica'],
        lighting: true,
        lightingCost: 500000,
        laborHours: 12,
        laborRate: 60000,
        profitMargin: 30,
    });

    const handleParamChange = (field: keyof SignageParams, value: any) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };
    
    const costBreakdown: CostBreakdown = useMemo(() => {
        const area = params.width * params.height;
        const perimeter = (params.width + params.height) * 2;

        const faceCost = area * params.facePrice;
        const frameCost = perimeter * params.framePrice;
        const lightingCost = params.lighting ? params.lightingCost : 0;
        
        const totalMaterialCost: CostItem = { 
            name: 'Chi phí vật tư', 
            value: faceCost + frameCost + lightingCost,
            details: `Mặt: ${area.toFixed(2)}m², Khung: ${perimeter.toFixed(2)}m`
        };

        const hardwareCost: CostItem = { name: 'Phụ kiện', value: 0, details: 'Chưa tính' }; // Placeholder

        const laborCost: CostItem = { 
            name: 'Chi phí nhân công', 
            value: params.laborHours * params.laborRate,
            details: `Thi công & lắp đặt`
        };

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
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-yellow-800">Tính năng "Gợi ý AI" cho bảng hiệu sắp ra mắt!</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center"><LightbulbIcon className="mr-2"/>Thông số bảng hiệu</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputField label="Ngang (m)" type="number" value={params.width} onChange={e => handleParamChange('width', e.target.value)} />
                        <InputField label="Cao (m)" type="number" value={params.height} onChange={e => handleParamChange('height', e.target.value)} />
                        <SelectField label="Loại bảng" value={params.signType} onChange={e => handleParamChange('signType', e.target.value)} options={SIGN_TYPES} />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Vật liệu</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField label="Vật liệu khung" value={params.frameMaterial} onChange={e => handleParamChange('frameMaterial', e.target.value)} options={Object.keys(FRAME_MATERIALS)} />
                        <InputField label="Đơn giá khung (/m)" type="number" value={params.framePrice} onChange={e => handleParamChange('framePrice', e.target.value)} />
                        <SelectField label="Vật liệu mặt" value={params.faceMaterial} onChange={e => handleParamChange('faceMaterial', e.target.value)} options={Object.keys(FACE_MATERIALS)} />
                        <InputField label="Đơn giá mặt (/m²)" type="number" value={params.facePrice} onChange={e => handleParamChange('facePrice', e.target.value)} />
                    </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Chiếu sáng & Chi phí khác</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div className="flex items-center space-x-2 pt-8">
                      <input type="checkbox" id="lighting" checked={params.lighting} onChange={e => handleParamChange('lighting', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="lighting" className="font-medium text-slate-700">Có đèn chiếu sáng</label>
                    </div>
                     <InputField label="Chi phí đèn (tổng)" type="number" value={params.lightingCost} onChange={e => handleParamChange('lightingCost', e.target.value)} disabled={!params.lighting} />
                    <InputField label="Giờ công (h)" type="number" value={params.laborHours} onChange={e => handleParamChange('laborHours', e.target.value)} />
                    <InputField label="Đơn giá công (/h)" type="number" value={params.laborRate} onChange={e => handleParamChange('laborRate', e.target.value)} />
                    <InputField label="Lợi nhuận (%)" type="number" value={params.profitMargin} onChange={e => handleParamChange('profitMargin', e.target.value)} />
                  </div>
                </div>
            </div>

            <div className="lg:sticky top-8 self-start">
                <CostResult breakdown={costBreakdown} productName={params.name || "Sản phẩm bảng hiệu"} />
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-200" />
    </div>
);

const SelectField = ({ label, options, ...props }: { label: string, options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default SignageCalculator;