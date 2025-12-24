import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * [Pipe] 日付フォーマット変換
 * 
 * アプリケーション全体で統一された日付形式 ("yyyy/MM/dd HH:mm") の知識をここに持ちます。
 * 
 * もし各画面で `date | date:'short'` や `date | date:'MM/dd'` のように
 * バラバラに書いてしまうと、デザイン統一の変更が入った際に地獄を見ます。
 * 
 * 「日付はどう表示されるべきか」という知識をこの Pipe 一箇所に DRY 化します。
 */
@Pipe({
  name: 'appFormatDate',
  standalone: true,
  // pure: true (デフォルト) なので、入力値が変わらない限り再計算されず高速
})
export class FormatDatePipe implements PipeTransform {

  // Angular標準のDatePipeを利用（車輪の再発明を避けるのもDRY）
  private datePipe = new DatePipe('en-US');

  transform(value: string | Date | null | undefined): string {
    if (!value) return '-';

    // ここでフォーマットを一元管理
    const format = 'yyyy/MM/dd HH:mm';
    
    return this.datePipe.transform(value, format) || '-';
  }
}
