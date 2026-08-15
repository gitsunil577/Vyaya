import PDFDocument from "pdfkit";

function formatINR(n) {
  return `Rs ${Number(n).toLocaleString("en-IN")}`;
}

// Password rule: username followed by the length of the username,
// e.g. "ananya" (6 letters) -> "ananya6".
export function pdfPasswordFor(username) {
  return `${username}${username.length}`;
}

/**
 * Builds the password-protected monthly ledger PDF as a Buffer.
 *
 * @param {object} params
 * @param {string} params.username
 * @param {string} params.monthLabel        e.g. "August 2026"
 * @param {number} params.total
 * @param {{category: string, amount: number}[]} params.categoryBreakdown
 * @param {{productName: string, category: string, customCategory?: string, price: number, remarks?: string, createdAt: Date}[]} params.expenses
 * @returns {Promise<Buffer>}
 */
export function generateExpensePdf({
  username,
  monthLabel,
  total,
  categoryBreakdown,
  expenses,
}) {
  const password = pdfPasswordFor(username);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: false,
        annotating: false,
      },
      // 1.7 ExtensionLevel 3 = 256-bit AES, the strongest PDFKit supports
      pdfVersion: "1.7ext3",
      info: {
        Title: `Vyaya — ${monthLabel} ledger`,
        Author: "Vyaya",
      },
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // --- header ---
    doc.fontSize(20).fillColor("#14110D").text("Vyaya — Monthly Ledger");
    doc.moveDown(0.2);
    doc
      .fontSize(11)
      .fillColor("#6b6b6b")
      .text(`${monthLabel}  ·  ${username}`);
    doc.moveDown(1.2);

    // --- total ---
    doc
      .fontSize(15)
      .fillColor("#14110D")
      .text(`Total spend: ${formatINR(total)}`);
    doc.moveDown(1);

    // --- category breakdown ---
    doc.fontSize(13).text("By category", { underline: true });
    doc.moveDown(0.4);
    if (categoryBreakdown.length === 0) {
      doc.fontSize(10).fillColor("#6b6b6b").text("No categorized spending this month.");
    } else {
      categoryBreakdown
        .sort((a, b) => b.amount - a.amount)
        .forEach(({ category, amount }) => {
          doc
            .fontSize(11)
            .fillColor("#14110D")
            .text(`${category}: ${formatINR(amount)}`);
        });
    }
    doc.moveDown(1);

    // --- line items ---
    doc.fontSize(13).text("All entries", { underline: true });
    doc.moveDown(0.4);
    if (expenses.length === 0) {
      doc.fontSize(10).fillColor("#6b6b6b").text("No expenses logged this month.");
    } else {
      expenses.forEach((e) => {
        const dateStr = new Date(e.createdAt).toLocaleDateString("en-IN");
        const cat = e.category === "Other" ? e.customCategory || "Other" : e.category;
        const remarksSuffix = e.remarks ? `  —  ${e.remarks}` : "";
        doc
          .fontSize(9.5)
          .fillColor("#14110D")
          .text(
            `${dateStr}   ${e.productName}   (${cat})   ${formatINR(e.price)}${remarksSuffix}`
          );
      });
    }

    doc.moveDown(1.5);
    doc
      .fontSize(8)
      .fillColor("#999")
      .text(
        "This PDF is password protected. Open it with your username followed by the number of letters in it."
      );

    doc.end();
  });
}
