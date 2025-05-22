//////////////////////////////////////
// 単純な型不一致
//////////////////////////////////////
let age: number;
age = "thirty"; // Type 'string' is not assignable to type 'number'.

//////////////////////////////////////
// オブジェクトのプロパティ不足
//////////////////////////////////////
interface User {
  id: number;
  name: string;
  email: string;
}

function displayUser(user: User) {
  console.log(`Name: ${user.name}, Email: ${user.email}`);
}

const myUser = {
  id: 1,
  name: "Alice",
};

displayUser(myUser);

// Argument of type '{ id: number; name: string; }' is not assignable to parameter of type 'User'.
//   Property 'email' is missing in type '{ id: number; name: string; }' but required in type 'User'.

// strictNullChecks が有効な場合の null / undefined
function getFirstName(name?: string): string {
  // return name; // Error!
  // Type 'string | undefined' is not assignable to type 'string'.
  //   Type 'undefined' is not assignable to type 'string'.
  if (name) {
    return name;
  }
  return "Guest";
}

let userName: string | undefined = undefined;
console.log(userName.toUpperCase()); // 'userName' is possibly 'undefined'.
if (userName) {
  console.log(userName.toUpperCase()); // Property 'toUpperCase' does not exist on type 'never'.
}

//////////////////////////////////////
// 関数の引数の型不一致
//////////////////////////////////////
function sum(a: number, b: number): number {
  return a + b;
}

sum(5, "10"); // Argument of type 'string' is not assignable to parameter of type 'number'.

//////////////////////////////////////
// 複雑なオブジェクトの例
//////////////////////////////////////
interface AppConfig {
  // 基本設定 (20個)
  appName: string;
  version: string;
  port: number;
  isProduction: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  apiKey: string;
  apiSecret: string;
  databaseUrl: string;
  featureToggleA: boolean;
  featureToggleB: boolean;
  timeoutMs: number;
  retryAttempts: number;
  adminEmail: string;
  supportEmail: string;
  maxUsers: number;
  defaultLanguage: string;
  themeColor: string;
  itemsPerPage: number;
  sessionSecret: string;
  analyticsId?: string; // オプショナル

  // UI設定 (10個)
  uiSettings: {
    showHeader: boolean;
    showFooter: boolean;
    sidebarMode: "fixed" | "collapsible";
    fontSize: number;
    fontFamily: string;
    darkMode: boolean;
    showNotifications: boolean;
    notificationPosition: "top-right" | "bottom-left";
    resultsPerPage: number;
    enableAnimations: boolean;
  };

  // 外部サービス連携 (10個)
  externalServices: {
    paymentGateway: {
      apiKey: string;
      isEnabled: boolean;
      serviceUrl: string;
    };
    emailService: {
      provider: "sendgrid" | "mailgun";
      apiKey: string;
      senderAddress: string;
    };
    cdnProvider?: {
      // オプショナルなネストオブジェクト
      name: string;
      url: string;
    };
    // ...その他サービス設定が続く想定
    serviceX: boolean;
    serviceYUrl: string;
  };

  // その他 (仮に5個)
  miscSetting1: string;
  miscSetting2: number;
  miscSetting3: boolean;
  miscSetting4: string[];
  miscSetting5: { nested: string };
}

// 不完全で型が一部間違っている設定オブジェクト
const config = {
  // 基本設定 (いくつか欠落、型間違い)
  appName: "My Awesome App",
  version: "1.0.0",
  port: "3000", // Error: string instead of number
  isProduction: false,
  // logLevel: 'info', // Error: Missing
  apiKey: "my-api-key",
  apiSecret: "my-api-secret",
  databaseUrl: "postgres://localhost/mydb",
  featureToggleA: true,
  featureToggleB: false,
  timeoutMs: 5000,
  retryAttempts: 3,
  adminEmail: "admin@example.com",
  supportEmail: "support@example.com",
  maxUsers: 1000,
  defaultLanguage: "en",
  themeColor: "#FFFFFF",
  itemsPerPage: 20,
  // sessionSecret: 'supersecret', // Error: Missing
  analyticsId: "UA-12345-1",

  // UI設定 (いくつか欠落、型間違い)
  uiSettings: {
    showHeader: true,
    showFooter: false,
    sidebarMode: "static", // Error: 'static' is not in 'fixed' | 'collapsible'
    fontSize: 16,
    fontFamily: "Arial",
    darkMode: true,
    showNotifications: true,
    notificationPosition: "top-right",
    // resultsPerPage: 10, // Error: Missing
    enableAnimations: "yes", // Error: string instead of boolean
  },

  // 外部サービス連携 (いくつか欠落、型間違い)
  externalServices: {
    paymentGateway: {
      apiKey: "pg_key",
      isEnabled: "true", // Error: string instead of boolean
      serviceUrl: "https://payment.example.com",
    },
    emailService: {
      provider: "sendgrid",
      apiKey: "sg_key",
      // senderAddress: 'noreply@example.com', // Error: Missing
    },
    // cdnProvider はオプショナルなので省略してもOK
    serviceX: true,
    serviceYUrl: "https://service-y.com",
  },

  // その他
  miscSetting1: "misc1",
  miscSetting2: 123,
  miscSetting3: true,
  miscSetting4: ["a", "b", 123], // Error: number in string[]
  miscSetting5: { nested: "value" },
};

const myAppConfig: AppConfig = config;
