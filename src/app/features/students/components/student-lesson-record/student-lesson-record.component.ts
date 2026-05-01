import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

import { take, filter, tap, catchError, EMPTY, finalize } from 'rxjs';

import { Dialog } from '@models/shared/diloag.model';
import { Select } from '@models/shared/select.model';
import { LessonRecord, LessonEntry } from '@models/entities/lesson-record.model';
import { LessonRecordFilter } from '@models/payload/lesson-record-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';
import { DialogService } from '@shared/services/dialog.service';

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  HeadingLevel,
  PageOrientation,
} from 'docx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-student-lesson-record',
  standalone: false,
  templateUrl: './student-lesson-record.component.html',
})
export class StudentLessonRecordComponent {
  loading = false;
  downloading = false;
  searchedQuery = String.Empty;
  studentId = String.Empty;
  studentName = String.Empty;
  pagedLessonRecords: PagedResponse<LessonRecord>;

  // ── Date filter ──────────────────────────────────────────────────────────
  selectedDateRange = String.Empty;
  customDateFrom = String.Empty;
  customDateTo = String.Empty;
  showCustomDates = false;

  dateRangeList: Select[] = [
    { Value: 'last_week', Display: 'گزشتہ ہفتہ' },
    { Value: 'last_month', Display: 'گزشتہ مہینہ' },
    { Value: 'last_6months', Display: 'گزشتہ 6 مہینے' },
    { Value: 'last_year', Display: 'گزشتہ سال' },
    { Value: 'custom', Display: 'مخصوص تاریخ' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private dialogService: DialogService,
    private apiHttpService: ApiHttpService
  ) {
    this.studentId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.fetchLessonRecords();
  }

  // ── Date range helpers ───────────────────────────────────────────────────

  onDateRangeChange(value: string) {
    this.selectedDateRange = value;
    this.showCustomDates = value === 'custom';
    if (value !== 'custom') {
      this.customDateFrom = String.Empty;
      this.customDateTo = String.Empty;
      this.fetchLessonRecords();
    }
  }

  onCustomDateChange() {
    if (this.customDateFrom && this.customDateTo) {
      this.fetchLessonRecords();
    }
  }

  getDateRange(): { from: string; to: string } | null {
    const now = new Date();
    const toStr = (d: Date) => d.toISOString().split('T')[0];

    switch (this.selectedDateRange) {
      case 'last_week': {
        const from = new Date(now);
        from.setDate(now.getDate() - 7);
        return { from: toStr(from), to: toStr(now) };
      }
      case 'last_month': {
        const from = new Date(now);
        from.setMonth(now.getMonth() - 1);
        return { from: toStr(from), to: toStr(now) };
      }
      case 'last_6months': {
        const from = new Date(now);
        from.setMonth(now.getMonth() - 6);
        return { from: toStr(from), to: toStr(now) };
      }
      case 'last_year': {
        const from = new Date(now);
        from.setFullYear(now.getFullYear() - 1);
        return { from: toStr(from), to: toStr(now) };
      }
      case 'custom': {
        if (this.customDateFrom && this.customDateTo) {
          return { from: this.customDateFrom, to: this.customDateTo };
        }
        return null;
      }
      default:
        return null;
    }
  }

  // ── Fetch ─────────────────────────────────────────────────────────────────

  fetchLessonRecords() {
    this.loading = true;
    const lessonFilter = this.constructLessonFilter();
    this.getLessonRecordsByFilter(lessonFilter);
  }

  constructLessonFilter(): LessonRecordFilter {
    const lessonFilter = new LessonRecordFilter();
    lessonFilter.StudentId = this.studentId;
    lessonFilter.SearchQuery = this.searchedQuery;

    const range = this.getDateRange();
    if (range) {
      lessonFilter.FromDate = range.from;
      lessonFilter.ToDate = range.to;
    }

    return lessonFilter;
  }

  getLessonRecordsByFilter(lessonFilter: LessonRecordFilter) {
    this.apiHttpService
      .filterLessonRecords(lessonFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LessonRecord>) => {
          this.pagedLessonRecords = res;
          if (res?.Items?.length > 0 && !this.studentName) {
            this.studentName = res.Items[0].StudentName;
          }
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  handlePageChange(index: number) {
    const lessonFilter = this.constructLessonFilter();
    lessonFilter.PageIndex = index;
    this.loading = true;
    this.getLessonRecordsByFilter(lessonFilter);
  }

  handleSearchClick(query: string) {
    this.searchedQuery = query;
    this.fetchLessonRecords();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  onAddNewButtonClick() {
    this.router.navigate([`students/lesson-record/form`], {
      queryParams: { studentId: this.studentId, studentName: this.studentName },
    });
  }

  onEditButtonClick(recordId: string) {
    this.router.navigate([`students/lesson-record/form/${recordId}`]);
  }

  handleDeleteButtonClick(recordId: string) {
    const dialogText: Dialog = {
      title: 'سبق ریکارڈ حذف کریں',
      message: 'کیا آپ واقعی اس سبق ریکارڈ کو حذف کرنا چاہتے ہیں؟',
      confirmText: 'حذف کریں',
      cancelText: 'منسوخ',
      confirmButtonClass: 'bg-secondary',
    };

    this.dialogService.confirm(dialogText).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.apiHttpService
          .deleteLessonRecord(recordId)
          .pipe(
            take(1),
            filter(res => !!res),
            tap((res: ActionResponse) => {
              this.toast.success(res?.Message);
              this.fetchLessonRecords();
            }),
            catchError(() => EMPTY)
          )
          .subscribe();
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ur-PK');
  }

  getLessonByType(record: LessonRecord, type: string): LessonEntry | null {
    return record?.Lessons?.find(l => l.Type === type) ?? null;
  }

  getTotalMistakes(record: LessonRecord): number {
    return record?.Lessons?.reduce((sum, l) => sum + (l.Mistakes ?? 0), 0) ?? 0;
  }

  // ── Word Document Download ────────────────────────────────────────────────

  async downloadRecord() {
    if (!this.pagedLessonRecords?.Items?.length) {
      this.toast.warning('ڈاؤنلوڈ کے لیے کوئی ریکارڈ موجود نہیں۔');
      return;
    }

    this.downloading = true;

    try {
      const items = this.pagedLessonRecords.Items;
      const now = new Date().toLocaleDateString('ur-PK');

      // ── Shared border style ────────────────────────────────────────────
      const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
      const borders = {
        top: cellBorder,
        bottom: cellBorder,
        left: cellBorder,
        right: cellBorder,
      };
      const headerShading = { fill: '1A6B6B', type: ShadingType.CLEAR };
      const altShading = { fill: 'F0F7F7', type: ShadingType.CLEAR };

      // ── Helper: make a header cell ─────────────────────────────────────
      const headerCell = (text: string, width: number) =>
        new TableCell({
          borders,
          width: { size: width, type: WidthType.DXA },
          shading: headerShading,
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text, bold: true, color: 'FFFFFF', size: 20, font: 'Arial' }),
              ],
            }),
          ],
        });

      // ── Helper: make a data cell ───────────────────────────────────────
      const dataCell = (
        text: string,
        width: number,
        isAlt: boolean,
        bold = false,
        color = '2C2C2C'
      ) =>
        new TableCell({
          borders,
          width: { size: width, type: WidthType.DXA },
          shading: isAlt ? altShading : { fill: 'FFFFFF', type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: text || '—', bold, color, size: 18, font: 'Arial' })],
            }),
          ],
        });

      const cols = [1600, 1350, 1350, 1350, 1350, 1350, 1350, 1450];
      const totalWidth = cols.reduce((a, b) => a + b, 0); // 11150

      // ── Table header row ───────────────────────────────────────────────
      const headerRow = new TableRow({
        tableHeader: true,
        children: [
          headerCell('کل غلطیاں', cols[0]),
          headerCell('منزل - غلطیاں', cols[1]),
          headerCell('منزل', cols[2]),
          headerCell('سبقی - غلطیاں', cols[3]),
          headerCell('سبقی ', cols[4]),
          headerCell('سبق - غلطیاں', cols[5]),
          headerCell('سبق', cols[6]),
          headerCell('تاریخ', cols[7]),
        ],
      });

      // ── Data rows ─────────────────────────────────────────────────────
      const dataRows = items.map((record, idx) => {
        const isAlt = idx % 2 === 1;
        const sabaq = this.getLessonByType(record, 'Sabaq');
        const sabqi = this.getLessonByType(record, 'Sabqi');
        const manzil = this.getLessonByType(record, 'Manzil');
        const total = this.getTotalMistakes(record);
        const totalColor = total === 0 ? '2E7D32' : total <= 3 ? 'F57F17' : 'C62828';

        return new TableRow({
          children: [
            dataCell(String(total), cols[7], isAlt, true, totalColor),
            dataCell(manzil ? String(manzil?.Mistakes) : '—', cols[6], isAlt),
            dataCell(manzil ? `${manzil?.ParaNumber}` : '—', cols[5], isAlt),
            dataCell(sabqi ? String(sabqi?.Mistakes) : '—', cols[4], isAlt),
            dataCell(sabqi ? `${sabqi?.ParaNumber}` : '—', cols[3], isAlt),
            dataCell(sabaq ? String(sabaq?.Mistakes) : '—', cols[2], isAlt),
            dataCell(sabaq ? `${sabaq?.ParaNumber}` : '—', cols[1], isAlt),
            dataCell(this.formatDate(record.Date), cols[0], isAlt),
          ],
        });
      });

      // ── Summary row ───────────────────────────────────────────────────
      const grandTotal = items.reduce((s, r) => s + this.getTotalMistakes(r), 0);
      const summaryRow = new TableRow({
        children: [
          new TableCell({
            columnSpan: 7,
            borders,
            width: { size: cols.slice(0, 7).reduce((a, b) => a + b, 0), type: WidthType.DXA },
            shading: { fill: 'E8F5E9', type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `کل ریکارڈ: ${items.length}`,
                    bold: true,
                    size: 20,
                    font: 'Arial',
                    color: '1A6B6B',
                  }),
                ],
              }),
            ],
          }),
          dataCell(
            String(grandTotal),
            cols[7],
            false,
            true,
            grandTotal === 0 ? '2E7D32' : grandTotal <= 10 ? 'F57F17' : 'C62828'
          ),
        ],
      });

      // ── Build document ────────────────────────────────────────────────
      const doc = new Document({
        styles: {
          default: {
            document: { run: { font: 'Arial', size: 22 } },
          },
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: 15840, // landscape: pass portrait height as width
                  height: 12240, // landscape: pass portrait width as height
                  orientation: PageOrientation.LANDSCAPE,
                },
                margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
              },
            },
            children: [
              // ── Institute name ─────────────────────────────────────────
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: 'جامعہ خدیجۃ الکبریٰ',
                    bold: true,
                    size: 40,
                    font: 'Arial',
                    color: '1A6B6B',
                  }),
                ],
              }),

              // ── Divider line ───────────────────────────────────────────
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A6B6B', space: 1 },
                },
                children: [new TextRun({ text: String.Empty })],
              }),

              // ── Report title ───────────────────────────────────────────
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: `${this.studentName} کا سبق ریکارڈ`,
                    bold: true,
                    size: 30,
                    font: 'Arial',
                    color: '2C2C2C',
                  }),
                ],
              }),

              // ── Print date + range info ────────────────────────────────
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                children: [
                  new TextRun({
                    text: `تاریخ طباعت: ${now}    |    کل اندراجات: ${items.length}`,
                    size: 18,
                    font: 'Arial',
                    color: '666666',
                  }),
                ],
              }),

              // ── Records table ──────────────────────────────────────────
              new Table({
                width: { size: totalWidth, type: WidthType.DXA },
                columnWidths: cols,
                rows: [headerRow, ...dataRows, summaryRow],
              }),

              // ── Footer note ────────────────────────────────────────────
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 300 },
                children: [
                  new TextRun({
                    text: 'یہ رپورٹ خودکار طریقے سے تیار کی گئی ہے۔',
                    size: 16,
                    font: 'Arial',
                    color: '999999',
                    italics: true,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `${this.studentName}-sabaq-record.docx`);
    } catch (err) {
      console.error('DOCX generation error:', err);
      this.toast.error('ڈاؤنلوڈ میں خرابی آئی۔ دوبارہ کوشش کریں۔');
    } finally {
      this.downloading = false;
    }
  }
}
