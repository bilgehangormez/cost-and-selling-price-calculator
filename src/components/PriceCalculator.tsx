"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";
import { z } from "zod";

// 📌 Form Şeması
const costSchema = z.object({
    electricity_kwh: z.string(),
    electricity_price: z.string(),
    randiman: z.string(),
    wheat_price: z.string(),
    bran_price: z.string(),
    bonkalit_price: z.string(),
    labor_cost: z.string(),
    bag_cost: z.string(),
    target_profit: z.string(),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);

    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "",
            electricity_price: "",
            randiman: "75",
            wheat_price: "",
            bran_price: "",
            bonkalit_price: "",
            labor_cost: "",
            bag_cost: "",
            target_profit: "",
        }
    });

    const onSubmit = (data: FormData) => {
        const calculator = new CostCalculator(
            parseFloat(data.electricity_kwh),
            parseFloat(data.electricity_price),
            parseFloat(data.randiman),
            parseFloat(data.wheat_price),
            parseFloat(data.labor_cost),
            parseFloat(data.bag_cost),
            parseFloat(data.bran_price),
            parseFloat(data.bonkalit_price),
            parseFloat(data.target_profit)
        );

        const result = calculator.calculateCosts();
        setFinalPrice(result.finalPrice);
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
                        
                        {/* Manuel Giriş Alanları */}
                        <h2 className="text-lg font-semibold mt-6">📌 Maliyet Girdileri</h2>
                        <div>
                            <Label>50 kg un için gerekli elektrik (kW)</Label>
                            <Input {...register("electricity_kwh")} />
                        </div>
                        <div>
                            <Label>1 kW elektrik (₺)</Label>
                            <Input {...register("electricity_price")} />
                        </div>
                        <div>
                            <Label>Randıman (%)</Label>
                            <Input {...register("randiman")} />
                        </div>
                        <div>
                            <Label>Buğday kg Fiyatı (₺)</Label>
                            <Input {...register("wheat_price")} />
                        </div>
                        <div>
                            <Label>Kepek kg Fiyatı (₺)</Label>
                            <Input {...register("bran_price")} />
                        </div>
                        <div>
                            <Label>Bonkalit kg Fiyatı (₺)</Label>
                            <Input {...register("bonkalit_price")} />
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
