import React from 'react';
import type { CostBreakdown, CostItem } from '../types';

interface CostResultProps {
  breakdown: CostBreakdown;
  productName: string;
}

const CostResult: React.FC<CostResultProps> = ({ breakdown, productName }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const CostRow = ({ item, isBold = false }: { item: CostItem, isBold?: boolean }) => (
    <div className="flex justify-between items-center py-3">
      <div>
        <p className={`font-medium ${isBold ? 'text-slate-800' : 'text-slate-600'}`}>{item.name}</p>
        {item.details && <p className="text-xs text-slate-400">{item.details}</p>}
      </div>
      <p className={`font-semibold ${isBold ? 'text-slate-900' : 'text-slate-700'}`}>{formatCurrency(item.value)}</p>
    </div>
  );

  return (
    <div className="bg-slate-50/70 rounded-xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-1">Báo giá dự kiến cho:</h3>
      <p className="text-indigo-600 font-semibold mb-6 truncate">{productName || 'Sản phẩm của bạn'}</p>

      <div className="space-y-2">
        <CostRow item={breakdown.materialCost} />
        <CostRow item={breakdown.hardwareCost} />
        <CostRow item={breakdown.laborCost} />
      </div>

      <div className="border-t border-slate-200 my-4"></div>

      <div className="space-y-3">
        <div className="flex justify-between font-medium text-slate-700">
          <span>Tổng chi phí sản xuất:</span>
          <span className="font-semibold">{formatCurrency(breakdown.totalCost)}</span>
        </div>
        <div className="flex justify-between font-medium text-slate-700">
          <span>Lợi nhuận dự kiến:</span>
          <span className="font-semibold">{formatCurrency(breakdown.profitMargin)}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-slate-800">Giá thành cuối cùng</span>
          <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">{formatCurrency(breakdown.finalPrice)}</span>
        </div>
        <p className="text-right text-xs text-slate-500 mt-1">(Giá chưa bao gồm VAT và chi phí vận chuyển)</p>
      </div>
    </div>
  );
};

export default CostResult;