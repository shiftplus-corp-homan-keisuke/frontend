'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Clock, Target, TrendingUp } from 'lucide-react';
import { useLearningStore } from '@/stores';
import type { Phase } from '@/types';

interface PhaseOverviewProps {
  selectedPhase?: string;
  onPhaseSelect: (phaseId: string) => void;
}

export const PhaseOverview: React.FC<PhaseOverviewProps> = ({
  selectedPhase,
  onPhaseSelect,
}) => {
  const { phases, tasks, progress, studySessions } = useLearningStore();

  // フェーズの統計情報を計算
  const getPhaseStats = (phase: Phase) => {
    const phaseTasks = tasks.filter(task => task.phaseId === phase.id);
    const completedTasks = phaseTasks.filter(task => task.status === 'completed');
    const inProgressTasks = phaseTasks.filter(task => task.status === 'in_progress');
    const totalTasks = phaseTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // フェーズの学習時間を計算
    const phaseStudyTime = studySessions
      .filter(session => session.phaseId === phase.id)
      .reduce((total, session) => total + session.duration, 0);

    // 予想総時間を計算
    const estimatedTotalTime = phaseTasks.reduce((total, task) => total + task.estimatedHours, 0);

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      completionRate,
      studyTime: phaseStudyTime,
      estimatedTotalTime,
    };
  };

  // 進捗率に応じたバッジバリアントを取得
  const getProgressVariant = (completionRate: number) => {
    if (completionRate >= 80) return 'success';
    if (completionRate >= 50) return 'warning';
    if (completionRate > 0) return 'info';
    return 'secondary';
  };

  // 時間を時間:分形式でフォーマット
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? `${mins}分` : ''}`;
    }
    return `${mins}分`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {phases.map((phase) => {
        const stats = getPhaseStats(phase);
        const isSelected = selectedPhase === phase.id;

        return (
          <Card 
            key={phase.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => onPhaseSelect(phase.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {phase.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {phase.description}
                  </p>
                </div>
                <Badge variant={getProgressVariant(stats.completionRate)} className="ml-2">
                  {Math.round(stats.completionRate)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 進捗バー */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>進捗</span>
                  <span>{stats.completedTasks}/{stats.totalTasks} タスク</span>
                </div>
                <Progress value={stats.completionRate} showLabel className="h-2" />
              </div>

              {/* 統計情報 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* 完了タスク */}
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {stats.completedTasks}
                    </p>
                    <p className="text-xs text-gray-500">完了</p>
                  </div>
                </div>

                {/* 進行中タスク */}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {stats.inProgressTasks}
                    </p>
                    <p className="text-xs text-gray-500">進行中</p>
                  </div>
                </div>

                {/* 学習時間 */}
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium text-purple-600 dark:text-purple-400">
                      {formatTime(stats.studyTime)}
                    </p>
                    <p className="text-xs text-gray-500">学習時間</p>
                  </div>
                </div>

                {/* 予想時間 */}
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="font-medium text-orange-600 dark:text-orange-400">
                      {stats.estimatedTotalTime}h
                    </p>
                    <p className="text-xs text-gray-500">予想時間</p>
                  </div>
                </div>
              </div>

              {/* 学習目標 */}
              {phase.learningObjectives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学習目標
                  </p>
                  <div className="space-y-1">
                    {phase.learningObjectives.slice(0, 2).map((objective, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          {objective}
                        </p>
                      </div>
                    ))}
                    {phase.learningObjectives.length > 2 && (
                      <p className="text-xs text-gray-500 pl-3.5">
                        他 {phase.learningObjectives.length - 2} 項目...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* フェーズ期間 */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>期間: {phase.duration}週間</span>
                  <span>順序: {phase.order}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};