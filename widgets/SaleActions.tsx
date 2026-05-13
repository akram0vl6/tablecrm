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
    <div className="py-5 fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-1 py-3 flex gap-3">
        <Button
          className="flex-1 border-indigo-200 hover:bg-indigo-50 transition-all duration-300"
          variant="outline"
          onClick={onCreateSale}
          disabled={!isConnected || cartEmpty || isCreating}
        >
          {"Создать продажу"}
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300"
          onClick={onCreateAndConduct}
          disabled={!isConnected || cartEmpty || isCreating}
        >
          {"Создать и провести"}
        </Button>
      </div>
    </div>
  );
}