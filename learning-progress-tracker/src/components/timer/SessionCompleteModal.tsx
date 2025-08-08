'use client';

import React, { useState } from 'react';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { StudySession, ProductivityRating } from '@/types';
import { cn } from '@/lib/utils';

interface SessionCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes?: string, productivity?: ProductivityRating) => void;
  duration: number; // 分
  taskId?: string;
  phaseId?: string;
}

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  duration,
  taskId,
  phaseId
}) => {
  const [notes, setNotes] = useState('');
  const [productivity, setProductivity] = useState<ProductivityRating>(3);

  const handleSave = () => {
    onSave(notes.trim() || undefined, productivity);
    setNotes('');
    setProductivity(3);
    onClose();
  };

  const handleCancel = () => {
    setNotes('');
    setProductivity(3);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const productivityLabels: Record<ProductivityRating, string> = {
    1: '低い',
    2: 'やや低い',
    3: '普通',
    4: 'やや高い',
    5: '高い'
  };

  const productivityColors: Record<ProductivityRating, string> = {
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-blue-600',
    5: 'text-green-600'
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="学習セッション完了">
      <div className="space-y-6">
        {/* セッション情報 */}
        <div className="flex items-center justify-center">
          <div className="text-center space-y-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">お疲れさまでした！</h3>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatDuration(duration)}</span>
            </div>
          </div>
        </div>

        {/* 集中度評価 */}
        <div className="space-y-3">
          <label className="text-sm font-medium">集中度を評価してください</label>
          <div className="flex justify-center gap-2">
            {([1, 2, 3, 4, 5] as ProductivityRating[]).map((rating) => (
              <button
                key={rating}
                onClick={() => setProductivity(rating)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors',
                  productivity === rating
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <Star
                  className={cn(
                    'h-5 w-5',
                    productivity === rating
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  )}
                />
                <span className="text-xs font-medium">{rating}</span>
                <span className={cn(
                  'text-xs',
                  productivity === rating
                    ? productivityColors[rating]
                    : 'text-muted-foreground'
                )}>
                  {productivityLabels[rating]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* メモ */}
        <div className="space-y-2">
          <label htmlFor="session-notes" className="text-sm font-medium">
            学習メモ（任意）
          </label>
          <Textarea
            id="session-notes"
            placeholder="今回の学習で学んだことや気づいたことを記録しましょう..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            記録を保存
          </Button>
        </div>
      </div>
    </Modal>
  );
};