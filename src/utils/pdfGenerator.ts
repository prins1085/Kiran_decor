
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Customer, QuotationItem } from "@/context/CustomerContext";
import autoTable from "jspdf-autotable";

export const generatePDF = (customer: Customer, returnBlob: boolean = false): Blob | void => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set basic properties
  doc.setFont("helvetica");
  
  // Title
  doc.setFontSize(20);
  doc.text("QUOTATION", pageWidth / 2, 20, { align: "center" });
  
  // Add order and date
  doc.setFontSize(10);
  doc.text(`ORDER NO: ${customer.id}`, 14, 30);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });
  doc.text(`DATE: ${currentDate}`, pageWidth - 14, 30, { align: "right" });

  // Customer details section
  doc.setFontSize(12);
  doc.text("Customer Details:", 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Name: ${customer.name}`, 14, 48);
  doc.text(`Phone: ${customer.phone}`, 14, 54);
  if (customer.architect) {
    doc.text(`Architect: ${customer.architect}`, 14, 60);
  }
  
  // Company logo/name (example)
  doc.setFontSize(14);
  doc.text("QuotePro", pageWidth - 14, 48, { align: "right" });
  doc.setFontSize(8);
  doc.text("Professional Quotations", pageWidth - 14, 54, { align: "right" });
  
  // Add quotation items table
  const tableHeaders = [
    ["#", "Description", "Quantity", "Rate", "Total"]
  ];
  
  const quotation = customer.quotations[0]; // Get the first quotation
  const tableData = quotation.items.map((item, index) => {
    // Format item details for the PDF
    let description = `${item.name} (${item.type})`;
    let quantity = "1";
    let rate = "0";
    
    if (item.details) {
      if (item.type === "curtain") {
        quantity = item.details.width && item.details.height 
          ? `${item.details.width}x${item.details.height}` 
          : "1";
        rate = item.details.pricePerMeter?.toString() || "0";
      } else if (item.type === "blind") {
        quantity = item.details.width && item.details.height 
          ? `${item.details.width}x${item.details.height}`
          : "1";
        rate = item.details.pricePerMeter?.toString() || "0";
      } else if (item.type === "sofa") {
        quantity = item.details.sofaSize 
          ? `${item.details.sofaSize} inches`
          : "1";
        rate = item.details.pricePerFoot?.toString() || "0";
      } else if (item.type === "mattress") {
        quantity = item.details.length && item.details.width
          ? `${item.details.length}x${item.details.width}`
          : "1";
        rate = item.details.pricePerSqFt?.toString() || "0";
      }
    }
    
    return [
      (index + 1).toString(),
      description,
      quantity,
      `₹${Number(rate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      `₹${item.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    ];
  });
  
  // Calculate grand total
  const grandTotal = quotation.items.reduce((sum, item) => sum + item.total, 0);
  tableData.push(["", "", "", "GRAND TOTAL:", `₹${grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]);
  
  // Add the table to the PDF
  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: 70,
    theme: 'grid',
    styles: { 
      fontSize: 9,
      cellPadding: 4 
    },
    headStyles: { 
      fillColor: [60, 60, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold' 
    },
    columnStyles: {
      0: { cellWidth: 10 },
      4: { halign: 'right' }
    },
    foot: [["", "", "", "GRAND TOTAL:", `₹${grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]],
    footStyles: { 
      fillColor: [240, 240, 240],
      fontStyle: 'bold' 
    }
  });
  
  // Add terms and conditions
  const tableEndY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text("Terms and Conditions:", 14, tableEndY);
  
  const terms = [
    "1. Prices can change without prior notice, price quoted at the time of order booking will be valid for the transaction.",
    "2. Custom orders once placed cannot be cancelled. All advances made are non-refundable.",
    "3. Credit notes are valid only with the stamp and signature of the store manager.",
    "4. Made made products or custom-made fabrics cannot be returned or exchanged after delivery.",
    "5. In case of manufacturing defects products will be replaced at the discretion of the management.",
    "6. For placement of custom order minimum of 75% advance on the total value of the bill is required.",
    "7. All exchange, replacements and credit notes will be processed at the discretion of the management. No cash refunds.",
    "8. Validity of Token Advance paid is 6 months from date of receipt.",
    "9. 100% advance of fabric value to be paid for placing the order."
  ];
  
  let yPos = tableEndY + 6;
  const lineHeight = 5;
  
  terms.forEach(term => {
    // Check if we need to add a new page
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(8);
    doc.text(term, 14, yPos);
    yPos += lineHeight;
  });
  
  // Add footer
  yPos += 5;
  doc.setFontSize(8);
  doc.text(`Generated by QuotePro on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  
  if (returnBlob) {
    // Return blob for WhatsApp sharing
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  } else {
    // Save the PDF
    doc.save(`Quotation_${customer.name}_${currentDate}.pdf`);
  }
};
