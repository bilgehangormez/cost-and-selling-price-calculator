"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form Schemas (Ondalıklı Sayılar Destekleniyor!)
const costSchema = z.object({
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    wheat_kg: z.string().min(1, "Gerekli buğday miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    bran_kg: z.string().min(1, "Çıkan kepek miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    bag_cost: z.string().min(1, "Çuval maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    target_profit: z.string().min(1, "Hedef Kâr zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const { handleSubmit } = useForm<FormData>({  // 🔥 Kullanılmayan `register` ve `errors` kaldırıldı!
        resolver: zodResolver(costSchema),
    });

    const onSubmit = (data: FormData) => {
        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const wheatCost = parseFloat(data.wheat_kg) * parseFloat(data.wheat_price);
        const laborCost = parseFloat(data.labor_cost);
        const bagCost = parseFloat(data.bag_cost);
        const branRevenue = parseFloat(data.bran_kg) * parseFloat(data.bran_price);
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - branRevenue;
        const finalPrice = totalCost + parseFloat(data.target_profit);

        setFinalPrice(finalPrice);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                    {finalPrice !== null && <div className="mt-4"><h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3></div>}
                </CardContent>
            </Card>
        </div>
    );
}
