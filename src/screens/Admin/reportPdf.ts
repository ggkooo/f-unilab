import { jsPDF } from 'jspdf';
import type { AttendanceReportResponse } from '../../services/adminService';

const formatDayLabel = (value: string): string => {
    const parsed = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    });
};

const formatReportTypeLabel = (value: string): string => {
    if (value === 'priority') {
        return 'Preferencial';
    }

    if (value === 'others') {
        return 'Outros';
    }

    return value.replace(/_/g, ' ');
};

export const createAttendanceReportPdf = (report: AttendanceReportResponse): void => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const usableWidth = pageWidth - margin * 2;

    const drawCard = (x: number, y: number, width: number, height: number, title: string, value: string, accent: [number, number, number]) => {
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(x, y, width, height, 4, 4, 'F');
        pdf.setFillColor(accent[0], accent[1], accent[2]);
        pdf.roundedRect(x, y, 3, height, 2, 2, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(71, 85, 105);
        pdf.setFontSize(10);
        pdf.text(title, x + 8, y + 8);
        pdf.setFontSize(18);
        pdf.setTextColor(15, 23, 42);
        pdf.text(value, x + 8, y + 18);
    };

    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 34, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('Relatorio de Atendimentos', margin, 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Periodo: ${report.period.start_date} ate ${report.period.end_date}`, margin, 22);
    pdf.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, margin, 28);

    let cursorY = 42;
    const cardGap = 6;
    const cardWidth = (usableWidth - cardGap) / 2;

    drawCard(margin, cursorY, cardWidth, 24, 'Total de atendimentos', String(report.total_attendances), [37, 99, 235]);
    drawCard(margin + cardWidth + cardGap, cursorY, cardWidth, 24, 'Tempo medio de espera', report.average_wait_time.formatted, [5, 150, 105]);
    cursorY += 30;
    drawCard(margin, cursorY, cardWidth, 24, 'Media por dia', report.average_attendances_per_day.toFixed(1), [234, 88, 12]);
    drawCard(margin + cardWidth + cardGap, cursorY, cardWidth, 24, 'Dias analisados', String(report.period.days), [139, 92, 246]);
    cursorY += 34;

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Atendimentos por dia', margin, cursorY);
    cursorY += 6;

    const dayEntries = Object.entries(report.attendances_per_day);
    const chartX = margin;
    const chartY = cursorY + 4;
    const chartWidth = usableWidth;
    const chartHeight = 46;
    const maxDayValue = Math.max(1, ...dayEntries.map(([, value]) => value));

    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(chartX, chartY, chartWidth, chartHeight, 4, 4);

    if (dayEntries.length === 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Nenhum dado diario encontrado no periodo.', chartX + 8, chartY + 20);
    } else {
        const barGap = 6;
        const innerWidth = chartWidth - 16;
        const barWidth = Math.max(12, (innerWidth - barGap * (dayEntries.length - 1)) / dayEntries.length);
        const totalBarsWidth = barWidth * dayEntries.length + barGap * (dayEntries.length - 1);
        let barX = chartX + (chartWidth - totalBarsWidth) / 2;

        dayEntries.forEach(([day, value]) => {
            const barHeight = (value / maxDayValue) * 26;
            const barY = chartY + 32 - barHeight;
            pdf.setFillColor(37, 99, 235);
            pdf.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(15, 23, 42);
            pdf.text(String(value), barX + barWidth / 2, barY - 2, { align: 'center' });
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(71, 85, 105);
            pdf.text(formatDayLabel(day), barX + barWidth / 2, chartY + 39, { align: 'center' });
            barX += barWidth + barGap;
        });
    }

    cursorY = chartY + chartHeight + 12;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text('Distribuicao por tipo', margin, cursorY);
    cursorY += 8;

    const typeEntries = Object.entries(report.attendances_by_type);
    const typeColors: Array<[number, number, number]> = [
        [245, 158, 11],
        [16, 185, 129],
        [59, 130, 246],
        [239, 68, 68],
    ];

    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, cursorY, usableWidth, 56, 4, 4);

    if (typeEntries.length === 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Nenhum dado por tipo encontrado no periodo.', margin + 8, cursorY + 18);
    } else {
        const maxTypeValue = Math.max(1, ...typeEntries.map(([, value]) => value));
        let rowY = cursorY + 12;

        typeEntries.forEach(([type, value], index) => {
            const color = typeColors[index % typeColors.length];
            const label = formatReportTypeLabel(type);
            const barMaxWidth = usableWidth - 78;
            const barWidth = (value / maxTypeValue) * barMaxWidth;

            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.setTextColor(51, 65, 85);
            pdf.text(label, margin + 8, rowY);
            pdf.setFillColor(241, 245, 249);
            pdf.roundedRect(margin + 38, rowY - 4, barMaxWidth, 6, 2, 2, 'F');
            pdf.setFillColor(color[0], color[1], color[2]);
            pdf.roundedRect(margin + 38, rowY - 4, Math.max(4, barWidth), 6, 2, 2, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(15, 23, 42);
            pdf.text(String(value), margin + 38 + barMaxWidth + 6, rowY);
            rowY += 14;
        });
    }

    const footerY = pageHeight - 10;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text('UNILAB Totem Relatorio administrativo gerado automaticamente', margin, footerY);

    pdf.save(`relatorio-atendimentos-${report.period.start_date}-${report.period.end_date}.pdf`);
};
