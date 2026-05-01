import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Component, Input } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { LessonRecord, LessonEntry } from '@models/entities/lesson-record.model';

@Component({
  selector: 'app-download-record',
  standalone: false,
  templateUrl: './download-record.component.html',
  styleUrl: './download-record.component.css',
})
export class DownloadRecordComponent {
  @Input() records: LessonRecord[] = [];
  @Input() studentName = String.Empty;
  @Input() instituteName = 'جامعہ خدیجۃ الکبریٰ';

  downloading = false;

  constructor(private toast: HotToastService) {}

  // ── Public trigger (called from parent via ViewChild or template) ─────────

  async download() {
    if (!this.records?.length) {
      this.toast.warning('ڈاؤنلوڈ کے لیے کوئی ریکارڈ موجود نہیں۔');
      return;
    }

    this.downloading = true;

    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // ── Register Urdu-compatible font fallback ──────────────────────────
      // jsPDF's built-in Helvetica handles Arabic/Urdu in reverse order natively
      // for simple text. For full RTL support in production, embed a Noto Nastaliq
      // font via doc.addFont() — see INTEGRATION-NOTES for details.
      doc.setFont('helvetica');

      const pageW = doc.internal.pageSize.getWidth(); // 297mm landscape
      const pageH = doc.internal.pageSize.getHeight(); //  210mm landscape
      const margin = 15;
      const contentW = pageW - margin * 2;

      // ── Header: institute name ─────────────────────────────────────────
      doc.setFontSize(20);
      doc.setTextColor(26, 107, 107); // teal #1A6B6B
      doc.setFont('helvetica', 'bold');
      doc.text(this.instituteName, pageW / 2, margin + 6, { align: 'center' });

      // ── Divider ────────────────────────────────────────────────────────
      doc.setDrawColor(26, 107, 107);
      doc.setLineWidth(0.6);
      doc.line(margin, margin + 10, pageW - margin, margin + 10);

      // ── Student name + report title ────────────────────────────────────
      doc.setFontSize(13);
      doc.setTextColor(44, 44, 44);
      doc.setFont('helvetica', 'bold');
      doc.text(`${this.studentName} - سبق ریکارڈ`, pageW / 2, margin + 18, { align: 'center' });

      // ── Print date + total count ───────────────────────────────────────
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      const printDate = new Date().toLocaleDateString('ur-PK');
      doc.text(
        `تاریخ طباعت: ${printDate}    |    کل اندراجات: ${this.records.length}`,
        pageW / 2,
        margin + 25,
        { align: 'center' }
      );

      // ── Table ──────────────────────────────────────────────────────────
      // RTL: rightmost column = تاریخ, leftmost = کل غلطیاں
      const tableHead = [
        [
          'کل غلطیاں',
          'منزل - غلطیاں',
          'منزل - پارہ',
          'سبقی - غلطیاں',
          'سبقی - پارہ',
          'سبق - غلطیاں',
          'سبق - پارہ',
          'تاریخ',
        ],
      ];

      const tableBody = this.records.map((record, idx) => {
        const sabaq = this.getLessonByType(record, 'Sabaq');
        const sabqi = this.getLessonByType(record, 'Sabqi');
        const manzil = this.getLessonByType(record, 'Manzil');
        const total = this.getTotalMistakes(record);

        return [
          String(total),
          manzil ? String(manzil.Mistakes) : '—',
          manzil ? `پارہ ${manzil.ParaNumber}` : '—',
          sabqi ? String(sabqi.Mistakes) : '—',
          sabqi ? `پارہ ${sabqi.ParaNumber}` : '—',
          sabaq ? String(sabaq.Mistakes) : '—',
          sabaq ? `پارہ ${sabaq.ParaNumber}` : '—',
          this.formatDate(record.Date),
        ];
      });

      // ── Summary row ────────────────────────────────────────────────────
      const grandTotal = this.records.reduce((s, r) => s + this.getTotalMistakes(r), 0);
      const summaryRow = [
        String(grandTotal),
        '',
        '',
        '',
        '',
        '',
        '',
        `کل ریکارڈ: ${this.records.length}`,
      ];

      autoTable(doc, {
        head: tableHead,
        body: [...tableBody, summaryRow],
        startY: margin + 30,
        margin: { left: margin, right: margin },
        tableWidth: contentW,
        styles: {
          font: 'helvetica',
          fontSize: 9,
          halign: 'center',
          valign: 'middle',
          cellPadding: 3,
          textColor: [44, 44, 44],
          lineColor: [204, 204, 204],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [26, 107, 107],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [240, 247, 247],
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
        },
        // Summary row styling
        didParseCell: data => {
          const isSummary = data.row.index === tableBody.length;
          if (isSummary) {
            data.cell.styles.fillColor = [232, 245, 233];
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [26, 107, 107];
          }

          // Color total mistakes column (col 0) by value
          if (data.column.index === 0 && data.section === 'body' && !isSummary) {
            const val = parseInt(data.cell.raw as string, 10);
            if (val === 0) {
              data.cell.styles.textColor = [46, 125, 50]; // green
            } else if (val <= 3) {
              data.cell.styles.textColor = [245, 127, 23]; // amber
            } else {
              data.cell.styles.textColor = [198, 40, 40]; // red
            }
            data.cell.styles.fontStyle = 'bold';
          }
        },
      });

      // ── Footer ─────────────────────────────────────────────────────────
      const finalY = (doc as any).lastAutoTable?.finalY ?? pageH - 20;
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.setFont('helvetica', 'italic');
      doc.text('یہ رپورٹ خودکار طریقے سے تیار کی گئی ہے۔', pageW / 2, finalY + 10, {
        align: 'center',
      });

      // ── Page numbers ────────────────────────────────────────────────────
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text(`${i} / ${pageCount}`, pageW - margin, pageH - 8, { align: 'right' });
      }

      // ── Save ────────────────────────────────────────────────────────────
      const fileName = `${this.studentName}-sabaq-record.pdf`;
      doc.save(fileName);
      this.toast.success('ریکارڈ ڈاؤنلوڈ ہو گیا۔');
    } catch (err) {
      console.error('PDF generation error:', err);
      this.toast.error('ڈاؤنلوڈ میں خرابی آئی۔ دوبارہ کوشش کریں۔');
    } finally {
      this.downloading = false;
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private getLessonByType(record: LessonRecord, type: string): LessonEntry | null {
    return record?.Lessons?.find(l => l.Type === type) ?? null;
  }

  private getTotalMistakes(record: LessonRecord): number {
    return record?.Lessons?.reduce((sum, l) => sum + (l.Mistakes ?? 0), 0) ?? 0;
  }

  private formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ur-PK');
  }
}
