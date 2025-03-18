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
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    randiman: z.string().min(1, "Randıman yüzdesi zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir yüzde girin"),
    bonkalit_percentage: z.string().min(1, "Bonkalit yüzdesi zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir yüzde girin"),
    wheat_price: z.string().min(1, "Buğday fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    bran_price: z.string().min(1, "Kepek fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    bonkalit_price: z.string().min(1, "Bonkalit fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    bag_cost: z.string().min(1, "1 Adet 50 kg PP Çuval Fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
    target_profit: z.string().min(1, "Hedeflenen kâr zorunludur").refine((val) => !isNaN(parseFloat(val)), "Geçerli bir değer girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "0",
            electricity_price: "0",
            randiman: "75",
            bonkalit_percentage: "10",
            wheat_price: "0",
            bran_price: "0",
            bonkalit_price: "0",
            labor_cost: "0",
            bag_cost: "0",
            target_profit: "0",
        }
    });

    // 🔹 Otomatik hesaplamalar
    const randimanValue = parseFloat(watch("randiman"));
    const bonkalitValue = parseFloat(watch("bonkalit_percentage"));
    const wheatPrice = parseFloat(watch("wheat_price"));
    const branPrice = parseFloat(watch("bran_price"));
    const bonkalitPrice = parseFloat(watch("bonkalit_price"));

    useEffect(() => {
        if (!isNaN(randimanValue) && randimanValue > 0) {
            const calculatedWheat = 50 / (randimanValue / 100);
            setWheatRequired(calculatedWheat);

            const totalByproduct = calculatedWheat - 50;
            const calculatedBonkalit = totalByproduct * (bonkalitValue / 100);
            const calculatedBran = totalByproduct - calculatedBonkalit;

            setBonkalitKg(calculatedBonkalit);
            setBranKg(calculatedBran);

            setBonkalitRevenue(calculatedBonkalit * bonkalitPrice);
            setBranRevenue(calculatedBran * branPrice);
        }
    }, [randimanValue, bonkalitValue, branPrice, bonkalitPrice]);

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
                        
                        <Label>🔹 **Otomatik Hesaplanan Değerler**</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Gerekli Buğday (kg)</Label>
                                <Input type="number" value={wheatRequired.toFixed(2)} disabled />
                            </div>
                            <div>
                                <Label>Çıkan Kepek (kg)</Label>
                                <Input type="number" value={branKg.toFixed(2)} disabled />
                            </div>
                            <div>
                                <Label>Çıkan Bonkalit (kg)</Label>
                                <Input type="number" value={bonkalitKg.toFixed(2)} disabled />
                            </div>
                        </div>

                        <Label>📌 **Maliyet Girdileri**</Label>
                        <Input placeholder="Elektrik kW" {...register("electricity_kwh")} />
                        <Input placeholder="Elektrik Fiyatı (₺)" {...register("electricity_price")} />
                        <Input placeholder="Buğday kg Fiyatı (₺)" {...register("wheat_price")} />
                        <Input placeholder="Kepek kg Fiyatı (₺)" {...register("bran_price")} />
                        <Input placeholder="Bonkalit kg Fiyatı (₺)" {...register("bonkalit_price")} />
                        <Input placeholder="İşçilik Maliyeti (₺)" {...register("labor_cost")} />
                        <Input placeholder="1 Adet 50 kg PP Çuval Fiyatı (₺)" {...register("bag_cost")} />
                        <Input placeholder="Hedeflenen Kâr (₺)" {...register("target_profit")} />

                        <Button type="submit">Hesapla</Button>
                    </form>

                    {finalPrice > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
