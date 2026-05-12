"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, CreditCard, Warehouse, Tag } from "lucide-react";

interface SaleParamsProps {
  isConnected: boolean;
  organizations: any[];
  payboxes: any[];
  warehouses: any[];
  priceTypes: any[];
  selectedOrg: string;
  setSelectedOrg: (v: string) => void;
  selectedPaybox: string;
  setSelectedPaybox: (v: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (v: string) => void;
  selectedPriceType: string;
  setSelectedPriceType: (v: string) => void;
}

export function SaleParams({ isConnected, organizations, payboxes, warehouses, priceTypes, selectedOrg, setSelectedOrg, selectedPaybox, setSelectedPaybox, selectedWarehouse, setSelectedWarehouse, selectedPriceType, setSelectedPriceType }: SaleParamsProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2 text-indigo-700">
          <Building2 className="h-5 w-5" />
          <h3 className="text-base font-semibold">3. Параметры продажи</h3>
        </div>
        <p className="text-sm text-gray-500 ml-7">
          Счёт, организация, склад и тип цены
        </p>
        <div className="grid grid-cols-1 gap-3">
          {/* Организация */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={!isConnected || organizations.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите организацию" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.short_name || org.full_name || org.work_name || org.name || `Орг #${org.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Счёт */}
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedPaybox} onValueChange={setSelectedPaybox} disabled={!isConnected || payboxes.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите счёт" />
              </SelectTrigger>
              <SelectContent>
                {payboxes.map((pb) => (
                  <SelectItem key={pb.id} value={pb.id.toString()}>
                    {pb.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Склад */}
          <div className="flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse} disabled={!isConnected || warehouses.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите склад" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id.toString()}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Тип цены */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedPriceType} onValueChange={setSelectedPriceType} disabled={!isConnected || priceTypes.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите тип цены" />
              </SelectTrigger>
              <SelectContent>
                {priceTypes.map((pt) => (
                  <SelectItem key={pt.id} value={pt.id.toString()}>
                    {pt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}