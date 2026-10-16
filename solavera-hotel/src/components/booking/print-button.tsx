"use client";

import { Printer } from "lucide-react";

export function PrintButton() { return <button type="button" onClick={() => window.print()} className="button button-outline print-button"><Printer size={17}/> Print Confirmation</button>; }
