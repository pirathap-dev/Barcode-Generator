// import React, { useMemo, useRef, useState } from 'react';
// import BarcodeCanvas from '../components/BarcodeCanvas';
// import QRCanvas from '../components/QRCanvas';
// import * as htmlToImage from 'html-to-image';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';


// export default function Generator({ user, onLogout }) {
//     const [text, setText] = useState('TICKET-0001');
//     const [format, setFormat] = useState('CODE128');
//     const [width, setWidth] = useState(2);
//     const [height, setHeight] = useState(80);
//     const [margin, setMargin] = useState(10);
//     const [displayValue, setDisplayValue] = useState(true);
//     const [useQR, setUseQR] = useState(false);
//     const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('hist') || '[]'));

//     const [prefix, setPrefix] = useState('EVT-2025-');
//     const [startNum, setStartNum] = useState(1);
//     const [count, setCount] = useState(100);      // how many to generate
//     const [pad, setPad] = useState(4);            // zero-padding for the number
//     const [suffix, setSuffix] = useState('');     // optional text after number
//     const [bulkBusy, setBulkBusy] = useState(false);

//     const nodeRef = useRef();

//     const hiddenRef = useRef(); // off-screen renderer for bulk PNGs


//     const addToHistory = (val) => {
//         const next = [val, ...history.filter(v => v !== val)].slice(0, 50);
//         setHistory(next); localStorage.setItem('hist', JSON.stringify(next));
//     };

//     const downloadPNG = async () => {
//         if (!nodeRef.current) return;
//         const dataUrl = await htmlToImage.toPng(nodeRef.current);
//         const a = document.createElement('a');
//         a.href = dataUrl; a.download = `${text}-${useQR ? 'QR' : format}.png`; a.click();
//     };

//     const makeIds = () => {
//         const n = Math.max(0, Math.min(1000, Number(count) || 0)); // clamp 0..1000
//         const start = Number(startNum) || 0;
//         const w = Math.max(0, Math.min(8, Number(pad) || 0)); // 0..8 pad
//         const ids = [];
//         for (let i = 0; i < n; i++) {
//             const num = String(start + i).padStart(w, '0');
//             ids.push(`${prefix}${num}${suffix}`);
//         }
//         return ids;
//     };

//     const renderOnePNG = async (val) => {
//         if (!hiddenRef.current) return null;

//         // Create a mount per code (fixed width like your preview so layout is consistent)
//         const holder = document.createElement('div');
//         holder.className = 'p-4 bg-white inline-block w-[360px]';
//         hiddenRef.current.appendChild(holder);

//         // Build a temporary React tree to render the barcode DOM
//         // We'll reuse your BarcodeCanvas via a transient container
//         return new Promise(async (resolve) => {
//             // Create a simple node with the same structure your preview uses
//             const wrapper = document.createElement('div');
//             wrapper.className = 'w-full';
//             holder.appendChild(wrapper);

//             // Inject an SVG via JsBarcode directly to avoid React mounting complexity
//             // (This keeps bundle small and avoids extra React roots per item)
//             const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//             wrapper.appendChild(svg);

//             try {
//                 // Use the same sizing options as your on-screen preview
//                 const JsBarcode = (await import('jsbarcode')).default;
//                 JsBarcode(svg, val, {
//                     format,
//                     width,
//                     height,
//                     margin,
//                     displayValue,
//                 });

//                 // Make SVG responsive so html-to-image captures consistently
//                 svg.removeAttribute('width');
//                 svg.removeAttribute('height');
//                 const bbox = svg.getBBox();
//                 const vbW = Math.max(1, bbox.width);
//                 const vbH = Math.max(1, bbox.height);
//                 svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
//                 svg.style.width = '100%';
//                 svg.style.height = 'auto';
//                 svg.style.display = 'block';

//                 // Convert to PNG
//                 const dataUrl = await htmlToImage.toPng(holder, { cacheBust: true });
//                 resolve(dataUrl);
//             } catch (e) {
//                 console.error('Bulk render error for', val, e);
//                 resolve(null);
//             } finally {
//                 // Clean up this item’s DOM
//                 holder.remove();
//             }
//         });
//     };

//     const bulkGenerateZip = async () => {
//         const ids = makeIds();
//         if (!ids.length) return;

//         setBulkBusy(true);
//         try {
//             const zip = new JSZip();
//             // Small batch loop
//             for (let i = 0; i < ids.length; i++) {
//                 const id = ids[i];
//                 const png = await renderOnePNG(id);
//                 if (png) {
//                     // Add to zip as PNG blob
//                     const res = await fetch(png);
//                     const blob = await res.blob();
//                     // Safe filename: replace problematic chars
//                     const safeName = id.replace(/[^a-zA-Z0-9._-]/g, '_');
//                     zip.file(`${safeName}.png`, blob);
//                 }
//             }
//             const content = await zip.generateAsync({ type: 'blob' });
//             saveAs(content, `barcodes_${ids.length}.zip`);
//         } finally {
//             setBulkBusy(false);
//         }
//     };


//     const codeNode = useMemo(() => (
//         <>
//             {/* Screen preview (scrollable, fixed width) */}
//             <div className="p-3 sm:p-4 bg-white inline-block w-full max-w-[320px] sm:max-w-[360px] overflow-x-auto overflow-y-hidden print:hidden mx-auto">
//                 {useQR ? (
//                     <div ref={nodeRef} className="flex justify-center">
//                         <QRCanvas value={text} size={180} />
//                     </div>
//                 ) : (
//                     <div ref={nodeRef} className="min-w-max w-full flex justify-center">
//                         <BarcodeCanvas
//                             value={text}
//                             format={format}
//                             width={width}
//                             height={height}
//                             margin={margin}
//                             displayValue={displayValue}
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* Print-only preview (full width, no overflow) */}
//             <div className="hidden print:block w-full bg-white p-4">
//                 {useQR ? (
//                     <QRCanvas value={text} size={200} />
//                 ) : (
//                     <div className="w-full">
//                         <BarcodeCanvas
//                             value={text}
//                             format={format}
//                             width={width}
//                             height={height}
//                             margin={margin}
//                             displayValue={displayValue}
//                         />
//                     </div>
//                 )}
//             </div>
//         </>
//     ), [text, format, width, height, margin, displayValue, useQR]);

//     return (
//         <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
//             {/* Header - Stack on mobile */}
//             <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">Barcode Generator</h2>
//                 <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-right">
//                     Signed in as <b className="break-all">{user.username}</b> · <button onClick={onLogout} className="underline hover:text-slate-800 transition-colors">Log out</button>
//                 </div>
//             </header>

//             {/* Hidden off-screen renderer for bulk export */}
//             <div className="fixed -left-[9999px] -top-[9999px]" ref={hiddenRef} />

//             {/* Main content - Stack on mobile */}
//             <section className="flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6">
//                 {/* Controls panel */}
//                 <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 md:p-6 order-2 xl:order-1">
//                     <div className="grid gap-3 sm:gap-4">
//                         <label className="grid gap-1 text-sm">
//                             <span>Text / Ticket ID</span>
//                             <input
//                                 value={text}
//                                 onChange={e => setText(e.target.value)}
//                                 placeholder="EX: EVNT-1234-ABCD"
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
//                             />
//                         </label>

//                         <label className="grid gap-1 text-sm">
//                             <span>Type</span>
//                             <select
//                                 value={useQR ? 'QR' : format}
//                                 onChange={e => (e.target.value === 'QR') ? setUseQR(true) : (setUseQR(false), setFormat(e.target.value))}
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
//                             >
//                                 <option value="CODE128">Barcode</option>
//                                 <option value="QR">QR Code (recommended)</option>
//                             </select>
//                         </label>

//                         {!useQR && (
//                             <>
//                                 {/* Barcode settings grid - 2 columns on larger screens */}
//                                 <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
//                                     <label className="grid gap-1 text-sm">
//                                         <span>Bar width</span>
//                                         <input
//                                             type="number"
//                                             min={1}
//                                             max={6}
//                                             value={width}
//                                             onChange={e => setWidth(Number(e.target.value) || 1)}
//                                             className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
//                                         />
//                                     </label>
//                                     <label className="grid gap-1 text-sm">
//                                         <span>Bar height</span>
//                                         <input
//                                             type="number"
//                                             min={40}
//                                             max={240}
//                                             value={height}
//                                             onChange={e => setHeight(Number(e.target.value) || 40)}
//                                             className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
//                                         />
//                                     </label>
//                                     <label className="grid gap-1 text-sm xs:col-span-2">
//                                         <span>Margin</span>
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             max={30}
//                                             value={margin}
//                                             onChange={e => setMargin(Number(e.target.value) || 0)}
//                                             className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
//                                         />
//                                     </label>
//                                 </div>

//                                 <label className="inline-flex items-center gap-2 text-sm mt-1">
//                                     <input
//                                         type="checkbox"
//                                         checked={displayValue}
//                                         onChange={e => setDisplayValue(e.target.checked)}
//                                         className="rounded border-slate-600 bg-slate-800 focus:ring-slate-500 w-4 h-4"
//                                     />
//                                     Show text label
//                                 </label>
//                             </>
//                         )}

//                         <button
//                             onClick={() => { addToHistory(text); downloadPNG(); }}
//                             className="rounded-xl bg-white text-slate-900 font-medium py-2.5 sm:py-2 hover:bg-slate-100 active:bg-slate-200 transition-colors w-full text-sm sm:text-base mt-1"
//                         >
//                             Download PNG
//                         </button>
//                     </div>

//                     {/* Bulk generation section */}
//                     <hr className="border-slate-700 my-2" />

//                     <h4 className="text-base font-semibold">Bulk Generate (ZIP)</h4>
//                     <p className="text-xs text-slate-400 -mt-1">Create up to 1000 barcodes by pattern.</p>

//                     <label className="grid gap-1 text-sm">
//                         <span>Prefix (text before number)</span>
//                         <input
//                             value={prefix}
//                             onChange={e => setPrefix(e.target.value)}
//                             className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
//                             placeholder="EVT-2025-"
//                         />
//                     </label>

//                     <div className="grid grid-cols-3 gap-3">
//                         <label className="grid gap-1 text-sm">
//                             <span>Start #</span>
//                             <input
//                                 type="number"
//                                 value={startNum}
//                                 onChange={e => setStartNum(e.target.value)}
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
//                             />
//                         </label>
//                         <label className="grid gap-1 text-sm">
//                             <span>Count</span>
//                             <input
//                                 type="number"
//                                 min={1}
//                                 max={1000}
//                                 value={count}
//                                 onChange={e => setCount(e.target.value)}
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
//                             />
//                         </label>
//                         <label className="grid gap-1 text-sm">
//                             <span>Pad</span>
//                             <input
//                                 type="number"
//                                 min={0}
//                                 max={8}
//                                 value={pad}
//                                 onChange={e => setPad(e.target.value)}
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
//                             />
//                         </label>
//                     </div>

//                     <label className="grid gap-1 text-sm">
//                         <span>Suffix (text after number)</span>
//                         <input
//                             value={suffix}
//                             onChange={e => setSuffix(e.target.value)}
//                             className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
//                             placeholder=""
//                         />
//                     </label>

//                     <button
//                         onClick={bulkGenerateZip}
//                         disabled={bulkBusy}
//                         className="rounded-xl bg-white text-slate-900 font-medium py-2"
//                     >
//                         {bulkBusy ? 'Generating…' : `Generate ZIP (${Math.min(1000, Number(count) || 0)} files)`}
//                     </button>


//                 </div>

//                 {/* Preview area */}
//                 <div className="grid place-items-center bg-slate-200 rounded-xl min-h-[200px] sm:min-h-[260px] p-3 sm:p-4 order-1 xl:order-2">
//                     {codeNode}
//                 </div>
//             </section>

//             {/* History section */}
//             <section className="mt-4 sm:mt-6 md:mt-8">
//                 <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Recent codes</h3>
//                 <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                     {history.length === 0 && (
//                         <div className="text-slate-500 text-xs sm:text-sm md:text-base">No history yet.</div>
//                     )}
//                     {history.map(v => (
//                         <button
//                             key={v}
//                             onClick={() => setText(v)}
//                             className="px-2.5 py-1.5 sm:px-3 sm:py-1 rounded-full border border-slate-300 bg-white text-xs sm:text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors whitespace-nowrap break-all max-w-[120px] sm:max-w-none truncate"
//                             title={v}
//                         >
//                             {v}
//                         </button>
//                     ))}
//                 </div>
//             </section>

//             {/* Footer note */}
//             <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 md:mt-6 text-center sm:text-left">
//                 Note: Code128 accepts alphanumeric ticket IDs.
//             </p>
//         </div>
//     );
// }




import React, { useMemo, useRef, useState } from 'react';
import BarcodeCanvas from '../components/BarcodeCanvas';
import QRCanvas from '../components/QRCanvas';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Generator({ user, onLogout }) {
    const [text, setText] = useState('TICKET-0001');
    const [format, setFormat] = useState('CODE128');
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(80);
    const [margin, setMargin] = useState(10);
    const [displayValue, setDisplayValue] = useState(true);
    const [useQR, setUseQR] = useState(false);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('hist') || '[]'));

    // Bulk generation state
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [prefix, setPrefix] = useState('EVT-2025-');
    const [startNum, setStartNum] = useState(1);
    const [count, setCount] = useState(100);
    const [pad, setPad] = useState(4);
    const [suffix, setSuffix] = useState('');
    const [bulkBusy, setBulkBusy] = useState(false);

    const nodeRef = useRef();
    const hiddenRef = useRef();

    const addToHistory = (val) => {
        const next = [val, ...history.filter(v => v !== val)].slice(0, 50);
        setHistory(next);
        localStorage.setItem('hist', JSON.stringify(next));
    };

    const downloadPNG = async () => {
        if (!nodeRef.current) return;
        const dataUrl = await htmlToImage.toPng(nodeRef.current);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${text}-${useQR ? 'QR' : format}.png`;
        a.click();
    };

    const makeIds = () => {
        const n = Math.max(0, Math.min(1000, Number(count) || 0));
        const start = Number(startNum) || 0;
        const w = Math.max(0, Math.min(8, Number(pad) || 0));
        const ids = [];
        for (let i = 0; i < n; i++) {
            const num = String(start + i).padStart(w, '0');
            ids.push(`${prefix}${num}${suffix}`);
        }
        return ids;
    };

    const renderOnePNG = async (val) => {
        if (!hiddenRef.current) return null;

        const holder = document.createElement('div');
        holder.className = 'p-4 bg-white inline-block w-[360px]';
        hiddenRef.current.appendChild(holder);

        return new Promise(async (resolve) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'w-full';
            holder.appendChild(wrapper);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            wrapper.appendChild(svg);

            try {
                const JsBarcode = (await import('jsbarcode')).default;
                JsBarcode(svg, val, {
                    format,
                    width,
                    height,
                    margin,
                    displayValue,
                });

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                const bbox = svg.getBBox();
                const vbW = Math.max(1, bbox.width);
                const vbH = Math.max(1, bbox.height);
                svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
                svg.style.width = '100%';
                svg.style.height = 'auto';
                svg.style.display = 'block';

                const dataUrl = await htmlToImage.toPng(holder, { cacheBust: true });
                resolve(dataUrl);
            } catch (e) {
                console.error('Bulk render error for', val, e);
                resolve(null);
            } finally {
                holder.remove();
            }
        });
    };

    const bulkGenerateZip = async () => {
        const ids = makeIds();
        if (!ids.length) return;

        setBulkBusy(true);
        try {
            const zip = new JSZip();
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const png = await renderOnePNG(id);
                if (png) {
                    const res = await fetch(png);
                    const blob = await res.blob();
                    const safeName = id.replace(/[^a-zA-Z0-9._-]/g, '_');
                    zip.file(`${safeName}.png`, blob);
                }
            }
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `barcodes_${ids.length}.zip`);
        } finally {
            setBulkBusy(false);
        }
    };

    const codeNode = useMemo(() => (
        <>
            {/* Screen preview */}
            <div className="p-3 sm:p-4 bg-white inline-block w-full max-w-[320px] sm:max-w-[360px] overflow-x-auto overflow-y-hidden print:hidden mx-auto">
                {useQR ? (
                    <div ref={nodeRef} className="flex justify-center">
                        <QRCanvas value={isBulkMode ? `${prefix}${String(startNum).padStart(pad, '0')}${suffix}` : text} size={180} />
                    </div>
                ) : (
                    <div ref={nodeRef} className="min-w-max w-full flex justify-center">
                        <BarcodeCanvas
                            value={isBulkMode ? `${prefix}${String(startNum).padStart(pad, '0')}${suffix}` : text}
                            format={format}
                            width={width}
                            height={height}
                            margin={margin}
                            displayValue={displayValue}
                        />
                    </div>
                )}
            </div>

            {/* Print-only preview */}
            <div className="hidden print:block w-full bg-white p-4">
                {useQR ? (
                    <QRCanvas value={isBulkMode ? `${prefix}${String(startNum).padStart(pad, '0')}${suffix}` : text} size={200} />
                ) : (
                    <div className="w-full">
                        <BarcodeCanvas
                            value={isBulkMode ? `${prefix}${String(startNum).padStart(pad, '0')}${suffix}` : text}
                            format={format}
                            width={width}
                            height={height}
                            margin={margin}
                            displayValue={displayValue}
                        />
                    </div>
                )}
            </div>
        </>
    ), [text, format, width, height, margin, displayValue, useQR, isBulkMode, prefix, startNum, pad, suffix]);

    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">Barcode Generator</h2>
                <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-right">
                    Signed in as <b className="break-all">{user.username}</b> · <button onClick={onLogout} className="underline hover:text-slate-800 transition-colors">Log out</button>
                </div>
            </header>

            {/* Hidden off-screen renderer */}
            <div className="fixed -left-[9999px] -top-[9999px]" ref={hiddenRef} />

            {/* Mode Toggle */}
            <div className="flex justify-center mb-4 sm:mb-6">
                <div className="bg-slate-100 rounded-xl p-1 inline-flex">
                    <button
                        onClick={() => setIsBulkMode(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isBulkMode
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Single Code
                    </button>
                    <button
                        onClick={() => setIsBulkMode(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isBulkMode
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Bulk Generate
                    </button>
                </div>
            </div>

            {/* Main content */}
            <section className="flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Controls panel */}
                <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 md:p-6 order-2 xl:order-1">
                    {!isBulkMode ? (
                        // Single Code Mode
                        <div className="grid gap-3 sm:gap-4">
                            <label className="grid gap-1 text-sm">
                                <span>Text / Ticket ID</span>
                                <input
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    placeholder="EX: EVNT-1234-ABCD"
                                    className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                />
                            </label>

                            <label className="grid gap-1 text-sm">
                                <span>Type</span>
                                <select
                                    value={useQR ? 'QR' : format}
                                    onChange={e => (e.target.value === 'QR') ? setUseQR(true) : (setUseQR(false), setFormat(e.target.value))}
                                    className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                >
                                    <option value="CODE128">Barcode</option>
                                    <option value="QR">QR Code (recommended)</option>
                                </select>
                            </label>

                            {!useQR && (
                                <>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                        <label className="grid gap-1 text-sm">
                                            <span>Bar width</span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={6}
                                                value={width}
                                                onChange={e => setWidth(Number(e.target.value) || 1)}
                                                className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                            />
                                        </label>
                                        <label className="grid gap-1 text-sm">
                                            <span>Bar height</span>
                                            <input
                                                type="number"
                                                min={40}
                                                max={240}
                                                value={height}
                                                onChange={e => setHeight(Number(e.target.value) || 40)}
                                                className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                            />
                                        </label>
                                        <label className="grid gap-1 text-sm xs:col-span-2">
                                            <span>Margin</span>
                                            <input
                                                type="number"
                                                min={0}
                                                max={30}
                                                value={margin}
                                                onChange={e => setMargin(Number(e.target.value) || 0)}
                                                className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                            />
                                        </label>
                                    </div>

                                    <label className="inline-flex items-center gap-2 text-sm mt-1">
                                        <input
                                            type="checkbox"
                                            checked={displayValue}
                                            onChange={e => setDisplayValue(e.target.checked)}
                                            className="rounded border-slate-600 bg-slate-800 focus:ring-slate-500 w-4 h-4"
                                        />
                                        Show text label
                                    </label>
                                </>
                            )}

                            <button
                                onClick={() => { addToHistory(text); downloadPNG(); }}
                                className="rounded-xl bg-white text-slate-900 font-medium py-2.5 sm:py-2 hover:bg-slate-100 active:bg-slate-200 transition-colors w-full text-sm sm:text-base mt-1"
                            >
                                Download PNG
                            </button>
                        </div>
                    ) : (
                        // Bulk Generation Mode
                        <div className="grid gap-3 sm:gap-4">
                            <div className="mb-2">
                                <h4 className="text-base font-semibold">Bulk Generate (ZIP)</h4>
                                <p className="text-xs text-slate-400 -mt-1">Create up to 1000 barcodes by pattern.</p>
                            </div>

                            <label className="grid gap-1 text-sm">
                                <span>Prefix (text before number)</span>
                                <input
                                    value={prefix}
                                    onChange={e => setPrefix(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    placeholder="EVT-2025-"
                                />
                            </label>

                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                                <label className="grid gap-1 text-sm">
                                    <span>Start #</span>
                                    <input
                                        type="number"
                                        value={startNum}
                                        onChange={e => setStartNum(e.target.value)}
                                        className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span>Count</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={1000}
                                        value={count}
                                        onChange={e => setCount(e.target.value)}
                                        className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span>Zero Pad</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={8}
                                        value={pad}
                                        onChange={e => setPad(e.target.value)}
                                        className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    />
                                </label>
                            </div>

                            <label className="grid gap-1 text-sm">
                                <span>Suffix (text after number)</span>
                                <input
                                    value={suffix}
                                    onChange={e => setSuffix(e.target.value)}
                                    className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    placeholder=""
                                />
                            </label>

                            <label className="inline-flex items-center gap-2 text-sm mt-1">
                                <input
                                    type="checkbox"
                                    checked={displayValue}
                                    onChange={e => setDisplayValue(e.target.checked)}
                                    className="rounded border-slate-600 bg-slate-800 focus:ring-slate-500 w-4 h-4"
                                />
                                Show text label
                            </label>

                            {/* Barcode settings for bulk mode */}
                            <div className="border-t border-slate-700 pt-3 mt-1">
                                <label className="grid gap-1 text-sm">
                                    <span>Type</span>
                                    <select
                                        value={useQR ? 'QR' : format}
                                        onChange={e => (e.target.value === 'QR') ? setUseQR(true) : (setUseQR(false), setFormat(e.target.value))}
                                        className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                    >
                                        <option value="CODE128">Barcode</option>
                                        {/* <option value="QR">QR Code (recommended)</option> */}
                                    </select>
                                </label>

                                {!useQR && (
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 mt-2">
                                        <label className="grid gap-1 text-sm">
                                            <span>Bar width</span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={6}
                                                value={width}
                                                onChange={e => setWidth(Number(e.target.value) || 1)}
                                                className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                            />
                                        </label>
                                        <label className="grid gap-1 text-sm">
                                            <span>Bar height</span>
                                            <input
                                                type="number"
                                                min={40}
                                                max={240}
                                                value={height}
                                                onChange={e => setHeight(Number(e.target.value) || 40)}
                                                className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full text-sm sm:text-base"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={bulkGenerateZip}
                                disabled={bulkBusy}
                                className="rounded-xl bg-white text-slate-900 font-medium py-2.5 sm:py-2 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full text-sm sm:text-base mt-1"
                            >
                                {bulkBusy ? 'Generating…' : `Generate ZIP (${Math.min(1000, Number(count) || 0)} files)`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Preview area */}
                <div className="grid place-items-center bg-slate-200 rounded-xl min-h-[200px] sm:min-h-[260px] p-3 sm:p-4 order-1 xl:order-2">
                    {codeNode}
                    {isBulkMode && (
                        <div className="mt-3 text-center text-slate-600 text-xs sm:text-sm">
                            Preview showing: {prefix}{String(startNum).padStart(pad, '0')}{suffix}
                        </div>
                    )}
                </div>
            </section>

            {/* History section - Only show in single mode */}
            {!isBulkMode && (
                <section className="mt-4 sm:mt-6 md:mt-8">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Recent codes</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {history.length === 0 && (
                            <div className="text-slate-500 text-xs sm:text-sm md:text-base">No history yet.</div>
                        )}
                        {history.map(v => (
                            <button
                                key={v}
                                onClick={() => setText(v)}
                                className="px-2.5 py-1.5 sm:px-3 sm:py-1 rounded-full border border-slate-300 bg-white text-xs sm:text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors whitespace-nowrap break-all max-w-[120px] sm:max-w-none truncate"
                                title={v}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer note */}
            <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 md:mt-6 text-center sm:text-left">
                Note: Code128 accepts alphanumeric ticket IDs.
            </p>
        </div>
    );
}