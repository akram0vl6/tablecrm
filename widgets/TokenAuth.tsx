"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Key } from "lucide-react";

interface TokenAuthProps {
  token: string;
  setToken: (v: string) => void;
  isConnected: boolean;
  onConnect: () => void;
  loadingDictionaries: boolean;
  dictionariesError: string;
}

export function TokenAuth({ token, setToken, isConnected, onConnect, loadingDictionaries, dictionariesError }: TokenAuthProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <Key className="h-5 w-5" />
          <h3 className="text-base font-semibold">1. Подключение кассы</h3>
        </div>
        <p className="text-sm text-gray-500 ml-7">
          Введите токен и загрузите справочники
        </p>
        <Input
          placeholder="Введите token кассы"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={isConnected}
          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-400"
        />
        <Button
          onClick={onConnect}
          disabled={!token.trim() || isConnected}
          className="w-full from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Подключить
        </Button>
        {loadingDictionaries && (
          <div className="space-y-2 ml-7">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {dictionariesError && (
          <p className="text-sm text-red-600 ml-7">{dictionariesError}</p>
        )}
      </CardContent>
    </Card>
  );
}