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

    const { register, handleSubmit, watch } = useForm({
        defaultValues: { randiman: "75" }
    });

    const randimanValue = watch("randiman");

    useEffect(() => {
        fetch("/randiman_oranlari.json")
            .then(res => res.json())
            .then(data => {
                const randimanKey = String(randimanValue);
                if (data[randimanKey]) {
                    const wheatRequired = 50 / (data[randimanKey].un_miktari / 100);
                    setWheatRequired(wheatRequired);
                    setBranKg((data[randimanKey].kepek * wheatRequired) / 100);
                    setBonkalitKg((data[randimanKey].bonkalit * wheatRequired) / 100);
                }
            });
    }, [randimanValue]);

    return (
        <div className="grid grid-cols-3 gap-4 mx-auto p-4">
            <Card> {/* Sol Kısım: Maliyet Girdileri */} </Card>
            <Card> {/* Orta Kısım: Otomatik Hesaplanan Değerler */} </Card>
            <Card> {/* Sağ Kısım: Satış Fiyatı */} </Card>
        </div>
    );
}
