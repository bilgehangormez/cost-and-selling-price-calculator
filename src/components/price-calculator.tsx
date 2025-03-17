"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";

// Form Schemas
const costSchema = z.object({
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    water_liters: z.string().min(1, "Gerekli su miktarı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    water_price: z.string().min(1, "Su fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    wheat_kg: z.string().min(1, "Gerekli buğday miktarı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    bag_cost: z.string().min(1, "Çuval maliyeti zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    profit_margin: z.string().min(1, "Kâr oranı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
});

type FormData = z.infer<typeof costSchema>;

// Form Field Component
interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    step?: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: { message?: string };
}

const FormField = ({ label, id, type = "text", step, register, error }: FormFieldProps) => (
    <div>
        <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
            {label}
        </Label>
        <Input
            id={id}
            type={type}
            step={step}
            {...register}
            className={cn("mt-1.5 h-12 rounded-xl bg-muted/50 px-4", error && "border-red-500 focus-visible:ring-red-500")}
        />
        {error?.message && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
);

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "0",
            electricity_price: "0",
            water_liters: "0",
            water_price: "0",
            wheat_kg: "0",
            wheat_price: "0",
            labor_cost: "0",
            bag_cost: "0",
            profit_margin: "10",
        }
    });

    const onSubmit = (data: FormData) => {
        const electricityCost = Number(data.electricity_kwh) * Number(data.electricity_price);
        const waterCost = Number(data.water_liters) * Number(data.water_price);
        const wheatCost = Number(data.wheat_kg) * Number(data.wheat_price);
        const laborCost = Number(data.labor_cost);
        const bagCost = Number(data.bag_cost);
        const totalCost = electricityCost + waterCost + wheatCost + laborCost + bagCost;
        const profit = totalCost * (Number(data.profit_margin) / 100);
        const finalPrice = totalCost + profit;

        setFinalPrice(finalPrice);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField label="50 kg çuval başına gereken kW" id="electricity_kwh" type="number" register={register("electricity_kwh")} error={errors.electricity_kwh} />
                        <FormField label="Güncel kW fiyatı (₺)" id="electricity_price" type="number" register={register("electricity_price")} error={errors.electricity_price} />
                        <FormField label="50 kg çuval başına su miktarı (L)" id="water_liters" type="number" register={register("water_liters")} error={errors.water_liters} />
                        <FormField label="Litre başına su fiyatı (₺)" id="water_price" type="number" register={register("water_price")} error={errors.water_price} />
                        <FormField label="Çuval başına gereken buğday miktarı (kg)" id="wheat_kg" type="number" register={register("wheat_kg")} error={errors.wheat_kg} />
                        <FormField label="Buğdayın kg fiyatı (₺)" id="wheat_price" type="number" register={register("wheat_price")} error={errors.wheat_price} />
                        <FormField label="Çuval başına işçilik maliyeti (₺)" id="labor_cost" type="number" register={register("labor_cost")} error={errors.labor_cost} />
                        <FormField label="50 kg PP çuval maliyeti (₺)" id="bag_cost" type="number" register={register("bag_cost")} error={errors.bag_cost} />
                        <FormField label="Hedef Kâr Oranı (%)" id="profit_margin" type="number" register={register("profit_margin")} error={errors.profit_margin} />

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>

                    {finalPrice !== null && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
