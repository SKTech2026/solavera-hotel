"use client";

export function PrintReceiptButton() {
  return (
    <button type="button" className="button button-dark" onClick={() => window.print()}>
      Print Receipt
    </button>
  );
}
