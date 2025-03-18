"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// 📌 Form Şeması
const costSchema = z.object({
    electricity_kwh: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    electricity_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    randiman: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100, "Geçerli bir yüzde girin"),
    wheat_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    bran_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    bonkalit_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    labor_cost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    bag_cost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    target_profit: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "0",
            electricity_price: "0",
            randiman: "75", // %75 randıman varsayılan
            wheat_price: "0",
            bran_price: "0",
            bonkalit_price: "0",
            labor_cost: "0",
            bag_cost: "0",
            target_profit: "0",
        }
    });

    // **Otomatik Hesaplamalar**
    const randimanValue = parseFloat(watch("randiman"));
    const wheatPrice = parseFloat(watch("wheat_price"));
    const branPrice = parseFloat(watch("bran_price"));
    const bonkalitPrice = parseFloat(watch("bonkalit_price"));

    useEffect(() => {
        if (!isNaN(randimanValue) && randimanValue > 0) {
            // 🔹 50 kg un için gereken buğday miktarı (100 kg üzerinden hesaplanan randıman ile)
            const calculatedWheat = 50 * (100 / randimanValue);
            setWheatRequired(calculatedWheat);

            // 🔹 Yan ürün hesaplamaları
            const totalByproduct = calculatedWheat - 50;
            const calculatedBonkalit = totalByproduct * 0.1; // Bonkalit sabit yüzde ile hesaplanıyor
            const calculatedBran = totalByproduct - calculatedBonkalit;

            setBonkalitKg(calculatedBonkalit);
            setBranKg(calculatedBran);

            setBonkalitRevenue(calculatedBonkalit * bonkalitPrice);
            setBranRevenue(calculatedBran * branPrice);
        }
    }, [randimanValue, branPrice, bonkalitPrice]);

    const onSubmit = (data: FormData) => {
        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const wheatCost = wheatRequired * wheatPrice;
        const laborCost = parseFloat(data.labor_cost);
        const bagCost = parseFloat(data.bag_cost);
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - (branRevenue + bonkalitRevenue);
        const calculatedFinalPrice = totalCost + parseFloat(data.target_profit);

        setFinalPrice(calculatedFinalPrice);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        {/* 🔹 Otomatik Hesaplanan Değerler */}
                        <Label className="text-lg font-semibold">🔹 Otomatik Hesaplanan Değerler</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Gerekli Buğday (kg)</Label>
                                <Input type="number" value={wheatRequired.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            </div>
                            <div>
                                <Label>Çıkan Kepek (kg)</Label>
                                <Input type="number" value={branKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            </div>
                            <div>
                                <Label>Çıkan Bonkalit (kg)</Label>
                                <Input type="number" value={bonkalitKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            </div>
                        </div>

                        {/* 📌 Maliyet Girdileri */}
                        <Label className="text-lg font-semibold">📌 Maliyet Girdileri</Label>
                        <Input placeholder="Elektrik kW" {...register("electricity_kwh")} />
                        <Input placeholder="Elektrik Fiyatı (₺)" {...register("electricity_price")} />
                        <Input placeholder="Randıman (%)" {...register("randiman")} />
                        <Input placeholder="Hedeflenen Kâr (₺)" {...register("target_profit")} />
                        <Input placeholder="Buğday kg Fiyatı (₺)" {...register("wheat_price")} />
                        <Input placeholder="Kepek kg Fiyatı (₺)" {...register("bran_price")} />
                        <Input placeholder="Bonkalit kg Fiyatı (₺)" {...register("bonkalit_price")} />
                        <Input placeholder="İşçilik Maliyeti (₺)" {...register("labor_cost")} />
                        <Input placeholder="1 Adet 50 kg PP Çuval Fiyatı (₺)" {...register("bag_cost")} />

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
