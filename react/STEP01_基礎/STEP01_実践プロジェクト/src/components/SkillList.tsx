import React from 'react';
import type { Skill } from '../types';
import { skillLevelLabels, skillLevelColors } from '../data/sampleData';

// スキルリストコンポーネントのProps型定義
interface SkillListProps {
  skills: Skill[];
}

/**
 * スキルリスト表示コンポーネント
 * 
 * 学習者が実装する内容：
 * 1. スキル配列のマップ処理（リストレンダリング）
 * 2. 各スキルアイテムの表示（名前、レベル、カテゴリ）
 * 3. スキルレベルに応じた色分け表示
 * 4. 適切なkey属性の設定
 */
function SkillList({ skills }: SkillListProps) {
  // TODO: 学習者が実装
  // ヒント: skills-section, skills-title, skills-grid, skill-item クラスを使用
  // ヒント: skillLevelLabels と skillLevelColors を活用
  
  return (
    <div>
      {/* ここにスキルリストのJSXを実装してください */}
      <p>SkillList コンポーネントを実装してください</p>
      <p>スキル数: {skills.length}</p>
    </div>
  );
}

export default SkillList;