"use client";
import { useEffect, useState, useRef } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Сбрасываем предыдущий таймер если был
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Сбрасываем состояние и запускаем заново
    setIsVisible(false);
    
    // Небольшая задержка чтобы сбросилась анимация
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Таймер автозакрытия
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, type, duration]); // перезапускаем при каждом новом message

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
        )}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button 
          onClick={() => { 
            setIsVisible(false); 
            if (timerRef.current) clearTimeout(timerRef.current);
            setTimeout(() => onClose(), 300); 
          }} 
          className="shrink-0 hover:opacity-70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}