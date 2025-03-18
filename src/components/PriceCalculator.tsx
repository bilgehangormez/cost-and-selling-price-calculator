"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";
import randimanOranlari from "@/randiman_oranlari.json"; // 📌 JSON doğrudan içe aktarılıyor

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, watch } = useForm({
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

    const randimanValue = watch("randiman");

    // 📌 Kullanıcının girdiği randıman değerine göre un, kepek ve bonkalit hesaplaması
    const updateCalculatedValues = (randimanKey: string) => {
        const data = randimanOranlari[randimanKey];
        if (data) {
            const calculatedWheat = (50 / data.un_miktari) * 100; // ✅ Doğru hesaplama
            setWheatRequired(calculatedWheat);
            setBranKg((data.kepek * calculatedWheat) / 100);
            setBonkalitKg((data.bonkalit * calculatedWheat) / 100);
        }
    };

    // Randıman değeri değiştiğinde hesaplamaları yap
    if (randimanValue) {
        updateCalculatedValues(randimanValue);
    }

    const onSubmit = async (data: Record<string, string>) => {
        const calculator = new CostCalculator(
            data.electricity_kwh,
            data.electricity_price,
            data.randiman,
            data.wheat_price,
            data.labor_cost,
            data.bag_cost,
            data.bran_price,
            data.bonkalit_price,
            data.target_profit
        );

        const result = await calculator.calculateCosts();
        setFinalPrice(result.finalPrice);
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-3 gap-4">
                {/* Sol Kısım: Maliyet Girdileri */}
                <Card className="shadow-lg rounded-xl border">
                    <CardHeader>
                        <CardTitle className="text-lg">📌 Maliyet Girdileri</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            <div>
                                <Label>İşçilik Maliyeti (₺)</Label>
                                <Input {...register("labor_cost")} />
                            </div>
                            <div>
                                <Label>1 Adet 50 kg PP Çuval (₺)</Label>
                                <Input {...register("bag_cost")} />
                            </div>
                            <div>
                                <Label>Hedeflenen Kâr (₺)</Label>
                                <Input {...register("target_profit")} />
                            </div>

                            <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Orta Kısım: Otomatik Hesaplanan Değerler */}
                <Card className="shadow-lg rounded-xl border">
                    <CardHeader>
                        <CardTitle className="text-lg">🔹 Otomatik Hesaplanan Değerler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
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
                    </CardContent>
                </Card>

                {/* Sağ Kısım: Hesaplanan Satış Fiyatı */}
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
