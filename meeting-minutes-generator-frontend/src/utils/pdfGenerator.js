import jsPDF from "jspdf";

export function generateMeetingReport(data) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 20;

  // Helper for wrapped text
  const addWrappedText = (text, x, y, maxWidth, lineHeight = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Title
  doc.setFontSize(18);
  doc.text("Meeting Minutes Report", pageWidth / 2, y, { align: "center" });
  y += 15;

  doc.setFontSize(12);

  // Summary
  doc.setFont(undefined, "bold");
  doc.text("Summary", 14, y);
  y += 8;

  doc.setFont(undefined, "normal");
  y = addWrappedText(data.summary, 14, y, pageWidth - 28);
  y += 6;

  // Key Decisions
  doc.setFont(undefined, "bold");
  doc.text("Key Decisions", 14, y);
  y += 8;

  doc.setFont(undefined, "normal");
  data.keyDecisions.forEach((decision) => {
    y = addWrappedText(`• ${decision}`, 16, y, pageWidth - 32);
  });
  y += 6;

  // Action Items
  doc.setFont(undefined, "bold");
  doc.text("Action Items", 14, y);
  y += 8;

  doc.setFont(undefined, "normal");
  data.actionItems.forEach((item) => {
    y = addWrappedText(
      `• ${item.description} (Owner: ${item.owner})`,
      16,
      y,
      pageWidth - 32
    );
  });

  // Footer
  doc.setFontSize(10);
  doc.text(
    `Meeting ID: ${data.meetingId}`,
    14,
    doc.internal.pageSize.getHeight() - 10
  );

  doc.save("meeting-minutes-report.pdf");
}
