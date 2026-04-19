import { jsPDF } from 'jspdf';

interface PDFStyles {
  primaryColor: [number, number, number];
  secondaryColor: [number, number, number];
  margin: number;
}

export class PDFBuilder {
  private doc: jsPDF;
  private cursorY: number;
  private margin: number;
  private pageWidth: number;
  private pageHeight: number;
  private contentWidth: number;
  private styles: PDFStyles;

  constructor(filename: string, styles?: Partial<PDFStyles>) {
    this.doc = new jsPDF();
    this.styles = {
      primaryColor: [37, 99, 235],
      secondaryColor: [71, 85, 105],
      margin: 20,
      ...styles
    };
    this.margin = this.styles.margin;
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.cursorY = this.margin;
  }

  addHeader(title: string, subtitle?: string) {
    this.doc.setFillColor(this.styles.primaryColor[0], this.styles.primaryColor[1], this.styles.primaryColor[2]);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title.toUpperCase(), this.margin, 20);
    
    if (subtitle) {
      this.doc.setFontSize(14);
      this.doc.text(subtitle.toUpperCase(), this.margin, 30);
    }
    
    this.cursorY = 55;
  }

  private checkPageBreak(neededHeight: number) {
    if (this.cursorY + neededHeight > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.cursorY = this.margin;
      return true;
    }
    return false;
  }

  addSectionTitle(title: string) {
    this.checkPageBreak(15);
    this.doc.setTextColor(this.styles.primaryColor[0], this.styles.primaryColor[1], this.styles.primaryColor[2]);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title.toUpperCase(), this.margin, this.cursorY);
    this.cursorY += 10;
  }

  addParagraph(text: string, fontSize: number = 10, isBold: boolean = false) {
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    const neededHeight = lines.length * (fontSize * 0.5) + 5;
    
    this.checkPageBreak(neededHeight);
    
    this.doc.text(lines, this.margin, this.cursorY);
    this.cursorY += neededHeight;
  }

  addClause(title: string, content: string) {
    this.addParagraph(title.toUpperCase(), 10, true);
    this.cursorY -= 2; // Tighten gap
    this.addParagraph(content, 9, false);
    this.cursorY += 2; // Add spacing after
  }

  addSignatureSession(partyA: { label: string, name: string }, partyB: { label: string, name: string }) {
    this.checkPageBreak(40);
    this.cursorY += 20;
    
    const signatureWidth = 70;
    
    // Lines
    this.doc.setDrawColor(this.styles.secondaryColor[0], this.styles.secondaryColor[1], this.styles.secondaryColor[2]);
    this.doc.line(this.margin, this.cursorY, this.margin + signatureWidth, this.cursorY);
    this.doc.line(this.pageWidth - this.margin - signatureWidth, this.cursorY, this.pageWidth - this.margin, this.cursorY);
    
    this.cursorY += 5;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text(partyA.label.toUpperCase(), this.margin + (signatureWidth / 2), this.cursorY, { align: 'center' });
    this.doc.text(partyB.label.toUpperCase(), this.pageWidth - this.margin - (signatureWidth / 2), this.cursorY, { align: 'center' });
    
    this.cursorY += 5;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.text(partyA.name.toUpperCase(), this.margin + (signatureWidth / 2), this.cursorY, { align: 'center' });
    this.doc.text(partyB.name.toUpperCase(), this.pageWidth - this.margin - (signatureWidth / 2), this.cursorY, { align: 'center' });
  }

  addFooter(text: string) {
    const pageCount = (this.doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        this.doc.setPage(i);
        this.doc.setDrawColor(226, 232, 240);
        this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
        this.doc.setFontSize(7);
        this.doc.setTextColor(this.styles.secondaryColor[0], this.styles.secondaryColor[1], this.styles.secondaryColor[2]);
        this.doc.text(`${text} - Página ${i} de ${pageCount}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }
  }

  save(filename: string) {
    this.doc.save(filename);
  }
}
