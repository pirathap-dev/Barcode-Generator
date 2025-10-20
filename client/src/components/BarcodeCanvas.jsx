import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeCanvas({ value, format='CODE128', width=2, height=80, displayValue=true, margin=10 }) {
  const ref = useRef();
  useEffect(() => {
    if (!value) return;
    try {
      JsBarcode(ref.current, value, { format, width, height, displayValue, margin });
    } catch (e) { console.error(e); }
  }, [value, format, width, height, displayValue, margin]);
  return <svg ref={ref} />;
}
