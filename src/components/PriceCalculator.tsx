"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form Şeması (Ondalıklı Sayılar Destekleniyor)
const costSchema = z.object({
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    wheat_kg: z.string().min(1, "50 kg Un için Gereken Buğday Miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    bran_kg: z.string().min(1, "Çıkan kepek miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    bag_cost: z.string().min(1, "50 kg çuval maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    pp_bag_price: z.string().min(1, "1 adet 50 kg PP çuval fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
    target_profit: z.string().min(1, "50 kg Çuvalda Hedeflenen Kâr zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir sayı girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [branRevenue, setBranRevenue] = useState<number | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(costSchema),
    });

    const onSubmit = (data: FormData) => {
        console.log("🟢 Hesaplama başladı...");

        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const wheatCost = parseFloat(data.wheat_kg) * parseFloat(data.wheat_price);
        const laborCost = parseFloat(data.labor_cost);
        const bagCost = parseFloat(data.bag_cost);
        const ppBagCost = parseFloat(data.pp_bag_price);
        const branRevenue = parseFloat(data.bran_kg) * parseFloat(data.bran_price);
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost + ppBagCost) - branRevenue;
        const finalPrice = totalCost + parseFloat(data.target_profit);

        console.log("✅ Hesaplanan toplam maliyet:", totalCost);
        console.log("✅ Hedeflenen kâr eklendikten sonraki fiyat:", finalPrice);

        // **useState güncellemeleri**
        setBranRevenue(() => branRevenue);
        setFinalPrice(() => finalPrice);

        console.log("🟢 Hesaplama tamamlandı!");
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="electricity_kwh">50 kg çuval başına gereken kW</Label>
                            <Input id="electricity_kwh" type="number" step="0.01" {...register("electricity_kwh")} />
                        </div>

                        <div>
                            <Label htmlFor="electricity_price">Güncel kW fiyatı (₺)</Label>
                            <Input id="electricity_price" type="number" step="0.01" {...register("electricity_price")} />
                        </div>

                        <div>
                            <Label htmlFor="wheat_kg">50 kg Un için Gereken Buğday Miktarı (kg)</Label>
                            <Input id="wheat_kg" type="number" step="0.01" {...register("wheat_kg")} />
                        </div>

                        <div>
                            <Label htmlFor="wheat_price">Buğdayın kg fiyatı (₺)</Label>
                            <Input id="wheat_price" type="number" step="0.01" {...register("wheat_price")} />
                        </div>

                        <div>
                            <Label htmlFor="bran_kg">Çıkan Kepek Miktarı (kg)</Label>
                            <Input id="bran_kg" type="number" step="0.01" {...register("bran_kg")} />
                        </div>

                        <div>
                            <Label htmlFor="bran_price">Kepek Kg Fiyatı (₺)</Label>
                            <Input id="bran_price" type="number" step="0.01" {...register("bran_price")} />
                        </div>

                        <div>
                            <Label htmlFor="labor_cost">İşçilik Maliyeti (₺)</Label>
                            <Input id="labor_cost" type="number" step="0.01" {...register("labor_cost")} />
                        </div>

                        <div>
                            <Label htmlFor="pp_bag_price">1 adet 50 kg PP Çuval Fiyatı (₺)</Label>
                            <Input id="pp_bag_price" type="number" step="0.01" {...register("pp_bag_price")} />
                        </div>

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>

                    {finalPrice !== null && (
                        <div className="mt-4 p-2 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                            <p className="text-sm text-muted-foreground">Kepek Geliri: {branRevenue?.toFixed(2)} ₺</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
