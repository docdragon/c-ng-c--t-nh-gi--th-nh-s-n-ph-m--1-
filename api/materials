import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { AllMaterials } from '../src/types';

const MATERIALS_KEY = 'tinhgia-materials-data';

const DEFAULT_DATA: AllMaterials = {
    furniture: {
        materials: [
            { name: 'MDF', price: 150000 },
            { name: 'MDF Chống Ẩm', price: 200000 },
            { name: 'HDF', price: 250000 },
            { name: 'Ván ép', price: 180000 },
            { name: 'MFC', price: 140000 }
        ],
        finishes: [
            { name: 'Sơn PU', price: 120000 },
            { name: 'Phủ Melamine', price: 80000 },
            { name: 'Phủ Laminate', price: 300000 },
            { name: 'Phủ Acrylic', price: 500000 },
            { name: 'Phủ Veneer', price: 250000 }
        ],
        hardware: [
            { name: 'Bản lề', price: 15000 },
            { name: 'Ray trượt', price: 50000 },
            { name: 'Tay nắm', price: 25000 },
            { name: 'Khóa', price: 40000 }
        ]
    },
    signage: {
        frames: [
            { name: 'Sắt', price: 50000 }, 
            { name: 'Nhôm', price: 80000 }, 
            { name: 'Inox', price: 120000 }
        ],
        faces: [
            { name: 'Mica', price: 400000 }, 
            { name: 'Alu', price: 350000 }, 
            { name: 'Bạt Hiflex', price: 80000 }
        ]
    }
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            let data = await kv.get<AllMaterials>(MATERIALS_KEY);
            if (!data) {
                // If no data exists, set and return the default data
                await kv.set(MATERIALS_KEY, DEFAULT_DATA);
                data = DEFAULT_DATA;
            }
            return res.status(200).json(data);
        } catch (error) {
            console.error('KV GET Error:', error);
            return res.status(500).json({ message: 'Error fetching data from KV store.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const newData: AllMaterials = req.body;
            // Basic validation
            if (!newData || !newData.furniture || !newData.signage) {
                return res.status(400).json({ message: 'Invalid data structure provided.' });
            }
            await kv.set(MATERIALS_KEY, newData);
            return res.status(200).json({ message: 'Data updated successfully.' });
        } catch (error) {
            console.error('KV SET Error:', error);
            return res.status(500).json({ message: 'Error updating data in KV store.' });
        }
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}