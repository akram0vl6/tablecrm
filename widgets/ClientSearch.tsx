"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Search, X } from "lucide-react";

interface ClientSearchProps {
  phone: string;
  setPhone: (v: string) => void;
  isConnected: boolean;
  onSearch: () => void;
  isSearching: boolean;
  client: any;
  clientError: string;
  onClearClient: () => void;
}

export function ClientSearch({ phone, setPhone, isConnected, onSearch, isSearching, client, clientError, onClearClient }: ClientSearchProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <User className="h-5 w-5" />
          <h3 className="text-base font-semibold">2. Клиент</h3>
        </div>
        <p className="text-sm text-gray-500 ml-7">
          Поиск клиента по телефону
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Введите телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isConnected}
            className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-indigo-400"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={!phone.trim() || isSearching || !isConnected}
            className="shrink-0"
            onClick={onSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="ml-7">
          <span className="text-xs font-medium text-gray-600">
            Найденный клиент
          </span>
          {isSearching ? (
            <Skeleton className="h-4 w-40 mt-1" />
          ) : client ? (
            <div className="mt-1 flex items-center gap-2 text-sm font-medium bg-gray-100 rounded-lg px-3 py-2 justify-between">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                {client.name || client.phone || `Клиент #${client.id}`}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClearClient}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : clientError ? (
            <p className="mt-1 text-sm text-red-500">{clientError}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-400 italic">
              Клиент не выбран
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}