import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (chartIds) => {
  const pdf = new jsPDF('landscape', 'pt', 'a4');

  for (const chartId of chartIds) {
    const el = document.getElementById(chartId);
    if (!el) continue;

    const canvas = await html2canvas(el);
    const imgData = canvas.toDataURL('image/png');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, width - 40, height);
    pdf.addPage();
  }

  pdf.save('selected_charts.pdf');
};

export const exportToCSV = (datasetsMap) => {
  for (const [chartName, datasets] of Object.entries(datasetsMap)) {
    const rows = [];
    const headers = new Set();

    datasets.forEach(ds => {
      headers.add('Label');
      ds.data.forEach((val, i) => headers.add(`Point ${i + 1}`));
    });

    const headerArray = Array.from(headers);
    rows.push(headerArray.join(','));

    datasets.forEach(ds => {
      const row = [ds.label, ...(ds.data || [])];
      rows.push(row.join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chartName.replace(/\s+/g, '_')}.csv`;
    link.click();
  }
};
