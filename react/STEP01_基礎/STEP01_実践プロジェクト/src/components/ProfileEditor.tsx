import React, { useState } from 'react';
import type { CompleteProfile, ProfileFormData, FormErrors } from '../types';

// プロフィール編集コンポーネントのProps型定義
interface ProfileEditorProps {
  profile: CompleteProfile;
  onSave: (updatedProfile: CompleteProfile) => void;
  onCancel: () => void;
}

/**
 * プロフィール編集コンポーネント
 * 
 * 学習者が実装する内容：
 * 1. フォーム状態管理（useState使用）
 * 2. 入力フィールドの実装（名前、メール、自己紹介、場所）
 * 3. フォームバリデーション（基本的な入力チェック）
 * 4. 保存・キャンセル機能
 * 5. エラーメッセージの表示
 */
function ProfileEditor({ profile, onSave, onCancel }: ProfileEditorProps) {
  // TODO: 学習者が実装
  // ヒント: useState でフォームデータとエラー状態を管理
  // ヒント: form-group, form-label, form-input クラスを使用
  
  // フォームデータの初期化例
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    location: profile.location || ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // TODO: 以下の関数を実装してください
  
  // 入力値変更ハンドラー
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    // フォームデータの更新とエラークリア処理を実装
  };

  // バリデーション関数
  const validateForm = (): boolean => {
    // 基本的なバリデーション処理を実装
    // 名前とメールは必須、メール形式チェックなど
    return true; // 仮の戻り値
  };

  // 保存ハンドラー
  const handleSave = () => {
    // バリデーション → 保存処理を実装
  };

  return (
    <div className="profile-card">
      {/* ここにプロフィール編集フォームのJSXを実装してください */}
      <h3>プロフィール編集</h3>
      <p>ProfileEditor コンポーネントを実装してください</p>
      
      {/* 実装例のヒント */}
      <div className="form-group">
        <label className="form-label">名前 *</label>
        <input 
          type="text" 
          className="form-input"
          value={formData.name}
          placeholder="名前を入力してください"
          // onChange イベントを実装
        />
        {/* エラーメッセージ表示 */}
      </div>
      
      {/* 他の入力フィールドも同様に実装 */}
      
      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-primary" style={{ marginRight: '10px' }}>
          保存
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default ProfileEditor;