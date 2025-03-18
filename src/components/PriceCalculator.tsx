"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";
import randimanOranlari from "@/randiman_oranlari.json"; // 📌 JSON dosyasını içe aktar
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

// ✅ **En Yakın Randıman Değerini Bulma Fonksiyonu**
const getClosestRandimanData = (randiman: number) => {
    const randimanKeys = Object.keys(randimanOranlari).map(Number);
    return randimanKeys.reduce((prev, curr) =>
        Math.abs(curr - randiman) < Math.abs(prev - randiman) ? curr : prev
    );
};

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
            randiman: "75",
            wheat_price: "",
            bran_price: "",
            bonkalit_price: "",
            labor_cost: "",
            bag_cost: "",
            target_profit: "",
        }
    });

    // 📌 Kullanıcının girdiği randıman değerini izleyerek ilgili hesaplamaları yap
    const randimanValue = parseFloat(watch("randiman") || "0");

    useEffect(() => {
        if (!isNaN(randimanValue) && randimanValue > 0) {
            const closestRandiman = getClosestRandimanData(randimanValue);
            const randimanData = randimanOranlari[String(closestRandiman)];

            if (randimanData) {
                setWheatRequired(randimanData.un_miktari * 0.5);
                setBranKg(randimanData.kepek * 0.5);
                setBonkalitKg(randimanData.bonkalit * 0.5);
            }
        }
    }, [randimanValue]);

    const onSubmit = (data: FormData) => {
        const calculator = new CostCalculator(
            parseFloat(data.electricity_kwh || "0"),
            parseFloat(data.electricity_price || "0"),
            parseFloat(data.randiman || "0"),
            parseFloat(data.wheat_price || "0"),
            parseFloat(data.labor_cost || "0"),
            parseFloat(data.bag_cost || "0"),
            parseFloat(data.bran_price || "0"),
            parseFloat(data.bonkalit_price || "0"),
            parseFloat(data.target_profit || "0")
        );

        const result = calculator.calculateCosts();
        setFinalPrice(result.finalPrice);
    };

    return (
        <div className="flex w-full max-w-4xl mx-auto p-4">
            <Card className="w-2/3 shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <h2 className="text-lg font-semibold">🔹 Otomatik Hesaplanan Değerler</h2>
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
                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
