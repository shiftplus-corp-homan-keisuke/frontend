# Session4: インターフェース分離の原則（ISP）をTypeScriptで理解する

インターフェース分離の原則は、「**クライアントに、自身が利用しないメソッドへの依存を強制してはならない**」という原則です。

これを、もっとシンプルな言葉で言うと、

**「一つの巨大で多機能なインターフェースを作るのではなく、特定の役割に特化した、小さなインターフェースをたくさん作るべきだ」**

ということです。

この原則は、単一責任の原則（SRP）をインターフェースに適用したものと考えることもできます。SRPがクラスの責任を一つに保つことを目指すのに対し、ISPはインターフェースの責任を一つに保つことを目指します。

## なぜインターフェース分離の原則が重要なのか？

もし、一つのインターフェースにあらゆる機能が詰め込まれていると（このようなインターフェースは「ファット・インターフェース」と呼ばれます）、次のような問題が発生します。

- **不要な実装の強制:** クラスが、実際には使わない機能のメソッドまで実装しなければならなくなります。その結果、中身が空だったり、エラーをスローするだけの無意味なメソッドが生まれてしまいます。
- **システムの硬直化:** あるクライアントが使ってもいないメソッドのシグネチャ（引数や戻り値の型など）が変更されただけで、そのインターフェースを実装している全てのクラスが影響を受けてしまいます。
- **凝集度の低下:** インターフェースが「何でも屋」になってしまい、その役割や目的が曖昧になります。

この原則を守ることで、各クラスは本当に必要な機能だけを実装すればよくなり、システムの結合度を下げ、柔軟性を高めることができます。

## TypeScriptでの具体例

オフィスにある複合機を例に考えてみましょう。複合機には印刷、スキャン、FAXといった複数の機能があります。

### 違反している例：

まず、これらの機能をすべて詰め込んだ、一つの巨大なインターフェースを定義します。

```typescript
// 違反例: ファット・インターフェース
interface IMultiFunctionDevice {
    print(document: any): void;
    scan(document: any): void;
    fax(document: any): void;
}
```

このインターフェースを、高性能な複合機クラスに実装するのは簡単です。

```typescript
class AllInOnePrinter implements IMultiFunctionDevice {
    print(document: any): void {
        console.log("Printing document...");
    }
    scan(document: any): void {
        console.log("Scanning document...");
    }
    fax(document: any): void {
        console.log("Faxing document...");
    }
}
```

しかし、ここで「印刷機能しか持たない、安価なプリンター」のクラスを作りたくなったとします。`IMultiFunctionDevice`を実装しようとすると、問題が発生します。

```typescript
class SimplePrinter implements IMultiFunctionDevice {
    print(document: any): void {
        console.log("Printing document...");
    }

    // このプリンターにはスキャン機能がない！しかし、インターフェースを満たすために実装を強制される。
    scan(document: any): void {
        // どう実装すればいい？
        // 1. 何もしない（空のメソッド）-> 呼び出し元は機能が実行されたと勘違いするかも
        // 2. エラーをスローする -> 実行時まで問題が発覚しない
        throw new Error("This device does not support scanning.");
    }

    // FAX機能もない！
    fax(document: any): void {
        throw new Error("This device does not support faxing.");
    }
}
```

`SimplePrinter`は、持っていない機能（`scan`, `fax`）の実装まで強制されています。これが**インターフェース分離の原則違反**です。`SimplePrinter`というクライアントは、利用しない`scan`や`fax`メソッドに依存させられているのです。

### 準拠している例：

この問題を解決するために、インターフェースを機能（役割）ごとに細かく分割します。

```typescript
// 準拠例: 機能ごとにインターフェースを分割

interface IPrinter {
    print(document: any): void;
}

interface IScanner {
    scan(document: any): void;
}

interface IFax {
    fax(document: any): void;
}
```

このように分割すれば、各クラスは本当に必要なインターフェースだけを実装すればよくなります。

**高性能な複合機の場合:**
必要な機能をすべて実装します。

```typescript
class AllInOnePrinter implements IPrinter, IScanner, IFax {
    print(document: any): void {
        console.log("Printing document...");
    }
    scan(document: any): void {
        console.log("Scanning document...");
    }
    fax(document: any): void {
        console.log("Faxing document...");
    }
}
```

**安価なプリンターの場合:**
`IPrinter`インターフェースだけを実装します。不要なメソッドを実装する必要はもうありません。

```typescript
class SimplePrinter implements IPrinter {
    print(document: any): void {
        console.log("Printing document...");
    }
}
```

### クライアント側のメリット

この設計は、これらのクラスを利用するクライアント側にもメリットがあります。例えば、ドキュメントを印刷するだけの関数は、印刷機能（`IPrinter`）だけを要求すればよくなります。

```typescript
// この関数は、渡されたデバイスがスキャンやFAX機能を持つかどうかを一切気にする必要がない。
// printメソッドさえ持っていればOK。
function processPrintJob(printer: IPrinter, document: any) {
    console.log("Sending a document to the printer...");
    printer.print(document);
}

const allInOne = new AllInOnePrinter();
const simple = new SimplePrinter();

// どちらのプリンターも、問題なくこの関数に渡すことができる！
processPrintJob(allInOne, "My Report");
processPrintJob(simple, "My Shopping List");
```

**実行結果:**

```
Sending a document to the printer...
Printing document...
Sending a document to the printer...
Printing document...
```

この例では、`processPrintJob`関数は`IPrinter`インターフェースだけを必要としています。`AllInOnePrinter`がスキャンやFAX機能を持っていても、この関数には全く影響しません。必要な機能（印刷）だけに依存しているからです。

## まとめ

インターフェース分離の原則は、**インターフェースをその利用者の視点から設計し、役割ごとに小さく保つ**ことを推奨する原則です。

これにより、クラスは不要な機能の実装を強制されなくなり、システム全体の疎結合性（依存関係の弱さ）が高まります。結果として、より柔軟で、変更しやすく、理解しやすいコードにつながるのです。
