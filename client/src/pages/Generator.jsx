// import React, { useMemo, useRef, useState } from 'react';
// import BarcodeCanvas from '../components/BarcodeCanvas';
// import QRCanvas from '../components/QRCanvas';
// import * as htmlToImage from 'html-to-image';

// export default function Generator({ user, onLogout }) {
//     const [text, setText] = useState('TICKET-0001');
//     const [format, setFormat] = useState('CODE128');
//     const [width, setWidth] = useState(2);
//     const [height, setHeight] = useState(80);
//     const [margin, setMargin] = useState(10);
//     const [displayValue, setDisplayValue] = useState(true);
//     const [useQR, setUseQR] = useState(false);
//     const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('hist') || '[]'));
//     const nodeRef = useRef();

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

//     const codeNode = useMemo(() => (
//         <div
//             ref={nodeRef}
//             className="p-4 bg-white inline-block max-w-[360px] overflow-x-auto overflow-y-hidden"
//         >
//             {useQR ? (
//                 <QRCanvas value={text} size={200} />
//             ) : (
//                 <div className="min-w-max">
//                     <BarcodeCanvas
//                         value={text}
//                         format={format}
//                         width={width}
//                         height={height}
//                         margin={margin}
//                         displayValue={displayValue}
//                     />
//                 </div>
//             )}
//         </div>
//     ), [text, format, width, height, margin, displayValue, useQR]);

//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             <header className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-semibold">Barcode Generator</h2>
//                 <div className="text-sm text-slate-600">
//                     Signed in as <b>{user.username}</b> · <button onClick={onLogout} className="underline">Log out</button>
//                 </div>
//             </header>

//             <section className="grid md:grid-cols-2 gap-4">
//                 <div className="bg-slate-900 text-white rounded-xl p-4">
//                     <div className="grid gap-3">
//                         <label className="grid gap-1 text-sm">
//                             <span>Text / Ticket ID</span>
//                             <input value={text} onChange={e => setText(e.target.value)} placeholder="EX: EVNT-1234-ABCD"
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500" />
//                         </label>
//                         <label className="grid gap-1 text-sm">
//                             <span>Type</span>
//                             <select value={useQR ? 'QR' : format}
//                                 onChange={e => (e.target.value === 'QR') ? setUseQR(true) : (setUseQR(false), setFormat(e.target.value))}
//                                 className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500">
//                                 <option value="CODE128">Barcode (recommended)</option>
//                                 {/* <option value="EAN13">EAN-13</option>
//                                 <option value="UPC">UPC-A</option> */}
//                                 <option value="QR">QR Code (optional)</option>
//                             </select>
//                         </label>
//                         {!useQR && (
//                             <>
//                                 <label className="grid gap-1 text-sm">
//                                     <span>Bar width</span>
//                                     <input type="number" min={1} max={6} value={width} onChange={e => setWidth(Number(e.target.value) || 1)}
//                                         className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500" />
//                                 </label>
//                                 <label className="grid gap-1 text-sm">
//                                     <span>Bar height</span>
//                                     <input type="number" min={40} max={240} value={height} onChange={e => setHeight(Number(e.target.value) || 40)}
//                                         className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500" />
//                                 </label>
//                                 <label className="grid gap-1 text-sm">
//                                     <span>Margin</span>
//                                     <input type="number" min={0} max={30} value={margin} onChange={e => setMargin(Number(e.target.value) || 0)}
//                                         className="px-3 py-2 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500" />
//                                 </label>
//                                 <label className="inline-flex items-center gap-2 text-sm">
//                                     <input type="checkbox" checked={displayValue} onChange={e => setDisplayValue(e.target.checked)} /> Show text label
//                                 </label>
//                             </>
//                         )}
//                         <button onClick={() => { addToHistory(text); downloadPNG(); }}
//                             className="rounded-xl bg-white text-slate-900 font-medium py-2">
//                             Download PNG
//                         </button>
//                     </div>
//                 </div>

//                 <div className="grid place-items-center bg-slate-200 rounded-xl min-h-[260px]">
//                     {codeNode}
//                 </div>
//             </section>

//             <section className="mt-6">
//                 <h3 className="text-lg font-semibold mb-2">Recent codes</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {history.length === 0 && <div className="text-slate-500">No history yet.</div>}
//                     {history.map(v => (
//                         <button key={v} onClick={() => setText(v)}
//                             className="px-3 py-1 rounded-full border border-slate-300 bg-white text-sm">
//                             {v}
//                         </button>
//                     ))}
//                 </div>
//             </section>

//             <p className="text-xs text-slate-500 mt-4">
//                 Note: Code128 accepts alphanumeric ticket IDs.
//             </p>
//         </div>
//     );
// }



import React, { useMemo, useRef, useState } from 'react';
import BarcodeCanvas from '../components/BarcodeCanvas';
import QRCanvas from '../components/QRCanvas';
import * as htmlToImage from 'html-to-image';

export default function Generator({ user, onLogout }) {
    const [text, setText] = useState('TICKET-0001');
    const [format, setFormat] = useState('CODE128');
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(80);
    const [margin, setMargin] = useState(10);
    const [displayValue, setDisplayValue] = useState(true);
    const [useQR, setUseQR] = useState(false);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('hist') || '[]'));
    const nodeRef = useRef();

    const addToHistory = (val) => {
        const next = [val, ...history.filter(v => v !== val)].slice(0, 50);
        setHistory(next); localStorage.setItem('hist', JSON.stringify(next));
    };

    const downloadPNG = async () => {
        if (!nodeRef.current) return;
        const dataUrl = await htmlToImage.toPng(nodeRef.current);
        const a = document.createElement('a');
        a.href = dataUrl; a.download = `${text}-${useQR ? 'QR' : format}.png`; a.click();
    };

    const codeNode = useMemo(() => (
        <>
            {/* Screen preview (scrollable, fixed width) */}
            <div className="p-3 sm:p-4 bg-white inline-block w-full max-w-[320px] sm:max-w-[360px] overflow-x-auto overflow-y-hidden print:hidden mx-auto">
                {useQR ? (
                    <div ref={nodeRef} className="flex justify-center">
                        <QRCanvas value={text} size={180} />
                    </div>
                ) : (
                    <div ref={nodeRef} className="min-w-max w-full flex justify-center">
                        <BarcodeCanvas
                            value={text}
                            format={format}
                            width={width}
                            height={height}
                            margin={margin}
                            displayValue={displayValue}
                        />
                    </div>
                )}
            </div>

            {/* Print-only preview (full width, no overflow) */}
            <div className="hidden print:block w-full bg-white p-4">
                {useQR ? (
                    <QRCanvas value={text} size={200} />
                ) : (
                    <div className="w-full">
                        <BarcodeCanvas
                            value={text}
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
    ), [text, format, width, height, margin, displayValue, useQR]);

    return (
        <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
            {/* Header - Stack on mobile */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">Barcode Generator</h2>
                <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-right">
                    Signed in as <b className="break-all">{user.username}</b> · <button onClick={onLogout} className="underline hover:text-slate-800 transition-colors">Log out</button>
                </div>
            </header>

            {/* Main content - Stack on mobile */}
            <section className="flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Controls panel */}
                <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 md:p-6 order-2 xl:order-1">
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
                                {/* Barcode settings grid - 2 columns on larger screens */}
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
                </div>

                {/* Preview area */}
                <div className="grid place-items-center bg-slate-200 rounded-xl min-h-[200px] sm:min-h-[260px] p-3 sm:p-4 order-1 xl:order-2">
                    {codeNode}
                </div>
            </section>

            {/* History section */}
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

            {/* Footer note */}
            <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 md:mt-6 text-center sm:text-left">
                Note: Code128 accepts alphanumeric ticket IDs.
            </p>
        </div>
    );
}