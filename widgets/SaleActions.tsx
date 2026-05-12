"use client";
import { Button } from "@/components/ui/button";

interface SaleActionsProps {
  isConnected: boolean;
  cartEmpty: boolean;
  isCreating: boolean;
  onCreateSale: () => void;
  onCreateAndConduct: () => void;
}

export function SaleActions({ isConnected, cartEmpty, isCreating, onCreateSale, onCreateAndConduct }: SaleActionsProps) {
  return (
    <div className="flex gap-3 pb-6">
      <Button
        className="flex-1 border-indigo-200 hover:bg-indigo-50 transition-all duration-300"
        variant="outline"
        onClick={onCreateSale}
        disabled={!isConnected || cartEmpty || isCreating}
      >
        {isCreating ? "Создание..." : "Создать продажу"}
      </Button>
      <Button
        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300"
        onClick={onCreateAndConduct}
        disabled={!isConnected || cartEmpty || isCreating}
      >
        {isCreating ? "Создание..." : "Создать и провести"}
      </Button>
    </div>
  );
}