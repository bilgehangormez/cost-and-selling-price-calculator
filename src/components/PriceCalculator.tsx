"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);

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

    useEffect(() => {
        if (randimanValue) {
            setWheatRequired(5000 / parseFloat(randimanValue));
        }
    }, [randimanValue]);

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
        setBranKg(result.branKg);
        setBonkalitKg(result.bonkalitKg);
        setBranRevenue(result.branRevenue);
        setBonkalitRevenue(result.bonkalitRevenue);
    };

    return (
        <div className="grid grid-cols-3 gap-4 mx-auto p-4">
            {/* 📌 Orta Kısım: Otomatik Hesaplanan Değerler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">🔹 Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Gerekli Buğday:</strong> {wheatRequired.toFixed(2)} kg</p>
                </CardContent>
            </Card>
        </div>
    );
}
