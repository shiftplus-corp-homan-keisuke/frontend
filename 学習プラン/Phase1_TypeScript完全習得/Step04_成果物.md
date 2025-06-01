# Step04 成果物：信号機システム

---

## 📝 システム概要

### 🚦 基本的な信号機システム

**目的**: Step04で学習したユニオン型と型ガードを活用して、信号機の状態管理システムを実装する

**主要機能**:
1. 信号機の状態管理（赤・黄・青）
2. 状態遷移の制御
3. タイマー機能
4. 複数の信号機の管理

**使用する型システム**:
- ユニオン型: 信号の色や状態の表現
- リテラル型: 具体的な値の厳密な型定義
- 型ガード: 状態の安全な判定
- 判別可能なユニオン: 状態の型安全な管理
- インターセクション型: 複数の型の組み合わせ

---

## 🚀 段階的実装手順

### Phase 1: 基本ユニオン型とリテラル型 🔰

#### ステップ1-1: 基本的な型定義

```typescript
// traffic-light.ts

// 信号の色（リテラル型のユニオン）
type LightColor = "red" | "yellow" | "green";

// 信号機の状態（リテラル型のユニオン）
type TrafficLightStatus = "active" | "inactive" | "maintenance";

// 信号機の種類（リテラル型のユニオン）
type TrafficLightType = "vehicle" | "pedestrian" | "arrow";

// 基本的な信号機の情報
interface TrafficLight {
  id: number;
  currentColor: LightColor;
  status: TrafficLightStatus;
  type: TrafficLightType;
  location: string;
}

// 信号変更の記録
interface LightChangeRecord {
  id: number;
  lightId: number;
  fromColor: LightColor;
  toColor: LightColor;
  timestamp: Date;
}

// 基本的な信号機管理クラス
class BasicTrafficLightManager {
  private lights: TrafficLight[] = [];
  private changeRecords: LightChangeRecord[] = [];
  private nextLightId: number = 1;
  private nextRecordId: number = 1;

  // 信号機の追加
  addTrafficLight(type: TrafficLightType, location: string): TrafficLight {
    const light: TrafficLight = {
      id: this.nextLightId++,
      currentColor: "red", // 初期状態は赤
      status: "active",
      type,
      location
    };

    this.lights.push(light);
    return light;
  }

  // 信号の色を変更
  changeLight(lightId: number, newColor: LightColor): boolean {
    const light = this.lights.find(l => l.id === lightId);
    
    if (!light || light.status !== "active") {
      return false;
    }

    const oldColor = light.currentColor;
    light.currentColor = newColor;

    // 変更記録を保存
    const record: LightChangeRecord = {
      id: this.nextRecordId++,
      lightId,
      fromColor: oldColor,
      toColor: newColor,
      timestamp: new Date()
    };
    
    this.changeRecords.push(record);
    return true;
  }

  // 信号機の状態を変更
  setLightStatus(lightId: number, status: TrafficLightStatus): boolean {
    const light = this.lights.find(l => l.id === lightId);
    
    if (!light) {
      return false;
    }

    light.status = status;
    return true;
  }

  // 全信号機の取得
  getAllLights(): TrafficLight[] {
    return [...this.lights];
  }

  // 特定の色の信号機を取得
  getLightsByColor(color: LightColor): TrafficLight[] {
    return this.lights.filter(light => light.currentColor === color);
  }

  // 特定の種類の信号機を取得
  getLightsByType(type: TrafficLightType): TrafficLight[] {
    return this.lights.filter(light => light.type === type);
  }

  // アクティブな信号機のみ取得
  getActiveLights(): TrafficLight[] {
    return this.lights.filter(light => light.status === "active");
  }

  // 変更履歴の取得
  getChangeRecords(): LightChangeRecord[] {
    return [...this.changeRecords];
  }
}
```

### Phase 2: 型ガード関数の実装 🔶

#### ステップ2-1: 基本的な型ガード関数

```typescript
// 型ガード関数の実装

// 信号の色の型ガード
function isRedLight(color: LightColor): color is "red" {
  return color === "red";
}

function isYellowLight(color: LightColor): color is "yellow" {
  return color === "yellow";
}

function isGreenLight(color: LightColor): color is "green" {
  return color === "green";
}

// 信号機状態の型ガード
function isActiveLight(status: TrafficLightStatus): status is "active" {
  return status === "active";
}

function isInactiveLight(status: TrafficLightStatus): status is "inactive" {
  return status === "inactive";
}

function isMaintenanceLight(status: TrafficLightStatus): status is "maintenance" {
  return status === "maintenance";
}

// 信号機種類の型ガード
function isVehicleLight(type: TrafficLightType): type is "vehicle" {
  return type === "vehicle";
}

function isPedestrianLight(type: TrafficLightType): type is "pedestrian" {
  return type === "pedestrian";
}

function isArrowLight(type: TrafficLightType): type is "arrow" {
  return type === "arrow";
}

// カスタム型ガード関数
function isValidTrafficLight(value: unknown): value is TrafficLight {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "currentColor" in value &&
    "status" in value &&
    "type" in value &&
    "location" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).location === "string"
  );
}

// 型ガードを活用した信号処理クラス
class TypeSafeTrafficProcessor {
  
  // 信号の色に基づく処理
  processLightColor(color: LightColor): string {
    if (isRedLight(color)) {
      return "停止してください";
    } else if (isYellowLight(color)) {
      return "注意してください";
    } else if (isGreenLight(color)) {
      return "進行してください";
    } else {
      // 全てのケースを処理済み
      throw new Error("未知の信号色です");
    }
  }

  // 信号機の状態に基づく処理
  processLightStatus(status: TrafficLightStatus): string {
    if (isActiveLight(status)) {
      return "信号機は正常に動作中です";
    } else if (isInactiveLight(status)) {
      return "信号機は停止中です";
    } else if (isMaintenanceLight(status)) {
      return "信号機はメンテナンス中です";
    } else {
      // 全てのケースを処理済み
      throw new Error("未知の信号機状態です");
    }
  }

  // 信号機の種類に基づく処理
  processLightType(type: TrafficLightType): string {
    if (isVehicleLight(type)) {
      return "車両用信号機";
    } else if (isPedestrianLight(type)) {
      return "歩行者用信号機";
    } else if (isArrowLight(type)) {
      return "矢印信号機";
    } else {
      // 全てのケースを処理済み
      throw new Error("未知の信号機種類です");
    }
  }

  // 不明なデータの安全な処理
  processUnknownData(data: unknown): string {
    if (isValidTrafficLight(data)) {
      return `信号機ID: ${data.id}, 場所: ${data.location}, 現在の色: ${data.currentColor}`;
    } else if (typeof data === "string") {
      return `文字列データ: ${data}`;
    } else if (typeof data === "number") {
      return `数値データ: ${data}`;
    } else {
      return "不明なデータ形式です";
    }
  }

  // 信号機の安全性チェック
  checkLightSafety(light: TrafficLight): {
    isSafe: boolean;
    message: string;
  } {
    if (!isActiveLight(light.status)) {
      return {
        isSafe: false,
        message: "信号機が非アクティブです"
      };
    }

    if (isVehicleLight(light.type) && isRedLight(light.currentColor)) {
      return {
        isSafe: true,
        message: "車両は安全に停止中です"
      };
    }

    if (isPedestrianLight(light.type) && isGreenLight(light.currentColor)) {
      return {
        isSafe: true,
        message: "歩行者は安全に横断できます"
      };
    }

    return {
      isSafe: true,
      message: "信号機は正常に動作中です"
    };
  }
}
```

### Phase 3: 判別可能なユニオンの活用 🔥

#### ステップ3-1: 判別可能なユニオンの設計

```typescript
// 判別可能なユニオンを使用した信号機システム

// 信号機の動作状態（判別可能なユニオン）
type LightOperation = 
  | { mode: "manual"; operator: string; lastChanged: Date }
  | { mode: "automatic"; cycleTime: number; nextChange: Date }
  | { mode: "emergency"; reason: string; activatedBy: string };

// 信号変更の結果（判別可能なユニオン）
type ChangeResult = 
  | { success: true; newColor: LightColor; timestamp: Date }
  | { success: false; error: string; currentColor: LightColor };

// 信号機のイベント（判別可能なユニオン）
type TrafficLightEvent = 
  | { type: "color-change"; lightId: number; fromColor: LightColor; toColor: LightColor; timestamp: Date }
  | { type: "status-change"; lightId: number; fromStatus: TrafficLightStatus; toStatus: TrafficLightStatus; timestamp: Date }
  | { type: "maintenance"; lightId: number; reason: string; scheduledBy: string; timestamp: Date }
  | { type: "emergency"; lightId: number; emergencyType: string; activatedBy: string; timestamp: Date };

// 交差点の状態（判別可能なユニオン）
type IntersectionState = 
  | { status: "normal"; vehicleLight: LightColor; pedestrianLight: LightColor }
  | { status: "emergency"; allLights: "red"; reason: string }
  | { status: "maintenance"; affectedLights: number[]; estimatedDuration: number };

// 高度な信号機管理クラス
class AdvancedTrafficLightManager extends BasicTrafficLightManager {
  private operations: { [lightId: number]: LightOperation } = {};
  private events: TrafficLightEvent[] = [];
  private intersectionState: IntersectionState = {
    status: "normal",
    vehicleLight: "red",
    pedestrianLight: "red"
  };

  // 信号機を手動モードに設定
  setManualMode(lightId: number, operator: string): boolean {
    const light = this.getAllLights().find(l => l.id === lightId);
    if (!light) {
      return false;
    }

    this.operations[lightId] = {
      mode: "manual",
      operator,
      lastChanged: new Date()
    };

    return true;
  }

  // 信号機を自動モードに設定
  setAutomaticMode(lightId: number, cycleTime: number): boolean {
    const light = this.getAllLights().find(l => l.id === lightId);
    if (!light) {
      return false;
    }

    const nextChange = new Date();
    nextChange.setSeconds(nextChange.getSeconds() + cycleTime);

    this.operations[lightId] = {
      mode: "automatic",
      cycleTime,
      nextChange
    };

    return true;
  }

  // 緊急モードの設定
  setEmergencyMode(lightId: number, reason: string, activatedBy: string): boolean {
    const light = this.getAllLights().find(l => l.id === lightId);
    if (!light) {
      return false;
    }

    this.operations[lightId] = {
      mode: "emergency",
      reason,
      activatedBy
    };

    // 緊急イベントを記録
    this.addEvent({
      type: "emergency",
      lightId,
      emergencyType: reason,
      activatedBy,
      timestamp: new Date()
    });

    return true;
  }

  // 安全な信号変更
  safeChangeLight(lightId: number, newColor: LightColor): ChangeResult {
    const light = this.getAllLights().find(l => l.id === lightId);
    
    if (!light) {
      return {
        success: false,
        error: "信号機が見つかりません",
        currentColor: "red"
      };
    }

    if (light.status !== "active") {
      return {
        success: false,
        error: "信号機がアクティブではありません",
        currentColor: light.currentColor
      };
    }

    const success = this.changeLight(lightId, newColor);
    
    if (success) {
      // イベントを記録
      this.addEvent({
        type: "color-change",
        lightId,
        fromColor: light.currentColor,
        toColor: newColor,
        timestamp: new Date()
      });

      return {
        success: true,
        newColor,
        timestamp: new Date()
      };
    } else {
      return {
        success: false,
        error: "信号変更に失敗しました",
        currentColor: light.currentColor
      };
    }
  }

  // 交差点の状態管理
  updateIntersectionState(vehicleLightId: number, pedestrianLightId: number): void {
    const vehicleLight = this.getAllLights().find(l => l.id === vehicleLightId);
    const pedestrianLight = this.getAllLights().find(l => l.id === pedestrianLightId);

    if (vehicleLight && pedestrianLight) {
      this.intersectionState = {
        status: "normal",
        vehicleLight: vehicleLight.currentColor,
        pedestrianLight: pedestrianLight.currentColor
      };
    }
  }

  // 緊急時の全信号停止
  emergencyStop(reason: string): void {
    this.intersectionState = {
      status: "emergency",
      allLights: "red",
      reason
    };

    // 全ての信号機を赤に変更
    for (const light of this.getAllLights()) {
      this.changeLight(light.id, "red");
    }
  }

  // メンテナンスモードの設定
  setMaintenanceMode(lightIds: number[], estimatedDuration: number): void {
    this.intersectionState = {
      status: "maintenance",
      affectedLights: lightIds,
      estimatedDuration
    };

    // 対象の信号機をメンテナンス状態に
    for (const lightId of lightIds) {
      this.setLightStatus(lightId, "maintenance");
    }
  }

  // イベントの追加
  private addEvent(event: TrafficLightEvent): void {
    this.events.push(event);
  }

  // 動作モードの取得
  getOperationMode(lightId: number): LightOperation | null {
    return this.operations[lightId] || null;
  }

  // イベント履歴の取得
  getEvents(): TrafficLightEvent[] {
    return [...this.events];
  }

  // 交差点状態の取得
  getIntersectionState(): IntersectionState {
    return this.intersectionState;
  }

  // 状態に基づくメッセージ取得
  getIntersectionMessage(): string {
    switch (this.intersectionState.status) {
      case "normal":
        return `通常運転中 - 車両: ${this.intersectionState.vehicleLight}, 歩行者: ${this.intersectionState.pedestrianLight}`;
      
      case "emergency":
        return `緊急停止中 - 理由: ${this.intersectionState.reason}`;
      
      case "maintenance":
        return `メンテナンス中 - 対象: ${this.intersectionState.affectedLights.length}台, 予定時間: ${this.intersectionState.estimatedDuration}分`;
      
      default:
        // 全てのケースを処理済み
        throw new Error("未知の交差点状態です");
    }
  }
}
```

### Phase 4: 実行例とテスト 🌟

#### ステップ4-1: システムのデモンストレーション

```typescript
// 使用例とテスト
function demonstrateTrafficLightSystem(): void {
  const manager = new AdvancedTrafficLightManager();
  const processor = new TypeSafeTrafficProcessor();

  console.log("=== 信号機システムのデモ ===");

  // 信号機の追加
  const vehicleLight = manager.addTrafficLight("vehicle", "交差点A - 車両用");
  const pedestrianLight = manager.addTrafficLight("pedestrian", "交差点A - 歩行者用");
  const arrowLight = manager.addTrafficLight("arrow", "交差点A - 右折用");

  console.log("追加された信号機:", [vehicleLight, pedestrianLight, arrowLight]);

  // 基本的な信号変更
  console.log("\n--- 基本的な信号変更 ---");
  manager.changeLight(vehicleLight.id, "green");
  manager.changeLight(pedestrianLight.id, "red");
  manager.changeLight(arrowLight.id, "yellow");

  console.log("変更後の信号機:", manager.getAllLights());

  // 型ガードを使用した処理
  console.log("\n--- 型ガードによる処理 ---");
  const allLights = manager.getAllLights();
  
  allLights.forEach(light => {
    console.log(`信号機${light.id}:`);
    console.log(`  色の指示: ${processor.processLightColor(light.currentColor)}`);
    console.log(`  状態: ${processor.processLightStatus(light.status)}`);
    console.log(`  種類: ${processor.processLightType(light.type)}`);
    
    const safety = processor.checkLightSafety(light);
    console.log(`  安全性: ${safety.message}`);
  });

  // 動作モードの設定
  console.log("\n--- 動作モード設定 ---");
  manager.setAutomaticMode(vehicleLight.id, 60); // 60秒サイクル
  manager.setManualMode(pedestrianLight.id, "交通管制員A");
  manager.setEmergencyMode(arrowLight.id, "事故発生", "緊急指令室");

  // 安全な信号変更
  console.log("\n--- 安全な信号変更 ---");
  const changeResult1 = manager.safeChangeLight(vehicleLight.id, "yellow");
  const changeResult2 = manager.safeChangeLight(999, "green"); // 存在しない信号機

  console.log("変更結果1:", changeResult1);
  console.log("変更結果2:", changeResult2);

  // 交差点状態の管理
  console.log("\n--- 交差点状態管理 ---");
  manager.updateIntersectionState(vehicleLight.id, pedestrianLight.id);
  console.log("交差点状態:", manager.getIntersectionMessage());

  // 緊急停止
  manager.emergencyStop("救急車通過");
  console.log("緊急停止後:", manager.getIntersectionMessage());

  // メンテナンスモード
  manager.setMaintenanceMode([vehicleLight.id, arrowLight.id], 30);
  console.log("メンテナンス後:", manager.getIntersectionMessage());

  // イベント履歴
  console.log("\n--- イベント履歴 ---");
  const events = manager.getEvents();
  events.forEach(event => {
    console.log(`${event.type}: 信号機${event.lightId} (${event.timestamp.toLocaleTimeString()})`);
  });
}

// ユニオン型とインターセクション型のデモ
function demonstrateUnionTypes(): void {
  console.log("\n=== ユニオン型のデモ ===");

  // ユニオン型の活用
  type LightColorOrStatus = LightColor | TrafficLightStatus;
  type LightInfo = LightColor | number | string;

  const values: LightColorOrStatus[] = ["red", "active", "yellow", "maintenance"];
  const info: LightInfo[] = ["green", 123, "交差点A", "blue"];

  console.log("LightColorOrStatus値:");
  values.forEach(value => {
    if (value === "red" || value === "yellow" || value === "green") {
      console.log(`信号色: ${value}`);
    } else {
      console.log(`状態: ${value}`);
    }
  });

  console.log("LightInfo値:");
  info.forEach(value => {
    if (typeof value === "string") {
      console.log(`文字列: ${value}`);
    } else if (typeof value === "number") {
      console.log(`数値: ${value}`);
    }
  });

  // インターセクション型の活用
  type TimestampedLight = TrafficLight & { createdAt: Date; updatedAt: Date };
  type ExtendedLight = TrafficLight & { description: string; priority: number };

  const timestampedLight: TimestampedLight = {
    id: 1,
    currentColor: "red",
    status: "active",
    type: "vehicle",
    location: "交差点B",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const extendedLight: ExtendedLight = {
    id: 2,
    currentColor: "green",
    status: "active",
    type: "pedestrian",
    location: "交差点C",
    description: "メイン通りの歩行者用信号",
    priority: 1
  };

  console.log("TimestampedLight:", timestampedLight);
  console.log("ExtendedLight:", extendedLight);
}

// 型安全性のデモ
function demonstrateTypeSafety(): void {
  console.log("\n=== 型安全性のデモ ===");

  const manager = new BasicTrafficLightManager();
  const processor = new TypeSafeTrafficProcessor();

  // 正しい使用法
  const light = manager.addTrafficLight("vehicle", "テスト交差点");
  console.log("正しい使用:", light);

  // TypeScriptが防ぐエラー（コメントアウト）
  // manager.addTrafficLight("invalid-type", "場所"); // Error: 無効な信号機種類
  // manager.changeLight(1, "purple"); // Error: 無効な信号色

  // 型ガードによる安全な処理
  const unknownData: unknown[] = [
    light,
    "red",
    123,
    { invalid: "data" }
  ];

  console.log("型ガードによる安全な処理:");
  unknownData.forEach((data, index) => {
    console.log(`データ ${index + 1}: ${processor.processUnknownData(data)}`);
  });
}

// 実行
demonstrateTrafficLightSystem();
demonstrateUnionTypes();
demonstrateTypeSafety();
```

---

## 🎓 学習のヒント

### 💡 実装時のポイント

1. **ユニオン型の活用**: 限定された値の集合を型安全に表現
2. **型ガード関数の設計**: 実行時の型チェックを型安全に行う
3. **判別可能なユニオンの理解**: 共通プロパティによる型の絞り込み
4. **リテラル型の活用**: 具体的な値を型として使用
5. **インターセクション型**: 複数の型を組み合わせた新しい型の作成

### ⚠️ よくある間違い

- ユニオン型で共通プロパティ以外にアクセスしようとする
- 型ガード関数での不完全な型チェック
- 判別可能なユニオンの判別プロパティを忘れる
- switch文でdefaultケースを適切に処理しない
- 型ガードの戻り値型注釈（`value is Type`）を忘れる

### 🚀 発展課題（任意）

余裕がある場合は以下にも挑戦してみてください：

- 複数の交差点を管理するシステム
- 信号機の自動制御アルゴリズム
- 交通量に基づく信号調整機能
- 緊急車両優先制御システム
- 信号機の故障検知機能

---

**📌 重要**: この成果物はStep04の学習内容の総まとめです。ユニオン型から型ガード、判別可能なユニオンまで、TypeScriptの型システムを実践的に活用しながら実装しましょう。

**🌟 次のステップ**: Step05では、ジェネリクスの基礎について学習します！
