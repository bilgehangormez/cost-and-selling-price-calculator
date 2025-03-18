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
    target_profit: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "",
            electricity_price: "",
            randiman: "75", // %75 randıman varsayılan
            target_profit: "",
        }
    });

    // **Otomatik Hesaplamalar**
    const randimanValue = parseFloat(watch("randiman"));

    useEffect(() => {
        if (!isNaN(randimanValue) && randimanValue > 0) {
            const calculatedWheat = 50 * (100 / randimanValue);
            setWheatRequired(calculatedWheat);

            const totalByproduct = calculatedWheat - 50;
            const calculatedBonkalit = totalByproduct * 0.1; // **Bonkalit %10 olarak varsayılmış**
            const calculatedBran = totalByproduct - calculatedBonkalit;

            setBonkalitKg(calculatedBonkalit);
            setBranKg(calculatedBran);
        }
    }, [randimanValue]);

    const onSubmit = (data: FormData) => {
        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const totalCost = electricityCost;
        const calculatedFinalPrice = totalCost + parseFloat(data.target_profit);

        setFinalPrice(calculatedFinalPrice);
    };

    return (
        <div className="flex w-full max-w-4xl mx-auto p-4">
            {/* Sol Kısım: Hesaplama Formu */}
            <Card className="w-2/3 shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        {/* Otomatik Hesaplanan Veriler */}
                        <Label>🔹 **Otomatik Hesaplanan Değerler**</Label>
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

                        {/* Manuel Giriş Alanları */}
                        <Label>📌 **Maliyet Girdileri**</Label>
                        <div>
                            <Label>Elektrik kW</Label>
                            <Input {...register("electricity_kwh")} />
                        </div>
                        <div>
                            <Label>Elektrik Fiyatı (₺)</Label>
                            <Input {...register("electricity_price")} />
                        </div>
                        <div>
                            <Label>Randıman (%)</Label>
                            <Input {...register("randiman")} />
                        </div>
                        <div>
                            <Label>Hedeflenen Kâr (₺)</Label>
                            <Input {...register("target_profit")} />
                        </div>

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Sağ Kısım: Hesaplanan Satış Fiyatı */}
            <div className="w-1/3 ml-4">
                <Card className="shadow-lg rounded-xl border">
                    <CardHeader>
                        <CardTitle className="text-lg">Satış Fiyatı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {finalPrice !== null ? (
                            <div className="p-4 text-center text-2xl font-bold bg-gray-50 rounded-lg">
                                {finalPrice.toFixed(2)} ₺
                            </div>
                        ) : (
                            <div className="p-4 text-center text-lg text-gray-500">
                                Henüz hesaplanmadı
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
