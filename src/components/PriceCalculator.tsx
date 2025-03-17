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
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    wheat_kg: z.string().min(1, "50 kg Un için Gereken Buğday Miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Pozitif bir sayı girin"),
    bran_kg: z.string().min(1, "Çıkan kepek miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    bag_cost: z.string().min(1, "50 kg çuval maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
    target_profit: z.string().min(1, "50 kg Çuvalda Hedeflenen Kâr zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Pozitif veya sıfır girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [branRevenue, setBranRevenue] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Hata mesajlarını tutar

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(costSchema),
    });

    const onSubmit = (data: FormData) => {
        try {
            console.log("Form Verileri:", data); // Debug için log ekledik

            const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
            const wheatCost = parseFloat(data.wheat_kg) * parseFloat(data.wheat_price);
            const laborCost = parseFloat(data.labor_cost);
            const bagCost = parseFloat(data.bag_cost);
            const branRevenue = parseFloat(data.bran_kg) * parseFloat(data.bran_price);
            const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - branRevenue;
            const finalPrice = totalCost + parseFloat(data.target_profit);

            setBranRevenue(branRevenue);
            setFinalPrice(finalPrice);
            setErrorMessage(null); // Hata yoksa sıfırla
        } catch (error) {
            console.error("Hesaplama Hatası:", error);
            setErrorMessage("Hesaplama sırasında bir hata oluştu. Lütfen tüm değerleri doğru girin.");
        }
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
                            {errors.electricity_kwh && <p className="text-red-500">{errors.electricity_kwh.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="electricity_price">Güncel kW fiyatı (₺)</Label>
                            <Input id="electricity_price" type="number" step="0.01" {...register("electricity_price")} />
                            {errors.electricity_price && <p className="text-red-500">{errors.electricity_price.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="wheat_kg">50 kg Un için Gereken Buğday Miktarı (kg)</Label>
                            <Input id="wheat_kg" type="number" step="0.01" {...register("wheat_kg")} />
                            {errors.wheat_kg && <p className="text-red-500">{errors.wheat_kg.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="labor_cost">İşçilik Maliyeti (₺)</Label>
                            <Input id="labor_cost" type="number" step="0.01" {...register("labor_cost")} />
                            {errors.labor_cost && <p className="text-red-500">{errors.labor_cost.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="target_profit">50 kg Çuvalda Hedeflenen Kâr (₺)</Label>
                            <Input id="target_profit" type="number" step="0.01" {...register("target_profit")} />
                            {errors.target_profit && <p className="text-red-500">{errors.target_profit.message}</p>}
                        </div>

                        {errorMessage && <p className="text-red-600 font-semibold">{errorMessage}</p>}

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>

                    {finalPrice !== null && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                            <p className="text-sm text-muted-foreground">Kepek Geliri: {branRevenue?.toFixed(2)} ₺</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
