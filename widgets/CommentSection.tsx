"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
  comment: string;
  setComment: (v: string) => void;
  isConnected: boolean;
}

export function CommentSection({ comment, setComment, isConnected }: CommentSectionProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 mb-20">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-base font-semibold">Комментарий</h3>
        </div>
        <p className="text-sm text-gray-500">
          Комментарий к заказу (необязательно)
        </p>
        <Textarea
          placeholder="Введите комментарий..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-indigo-400"
          disabled={!isConnected}
        />
      </CardContent>
    </Card>
  );
}