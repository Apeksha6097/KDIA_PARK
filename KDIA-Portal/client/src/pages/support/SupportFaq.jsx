import React, { useState } from 'react';


const MOCK_FAQS = [
    { category: 'Allocations', question: 'How is customer quota capacity calculated?', answer: 'Customer capacity targets are calculated based on their monthly consumption requirements and sanction limits in coordination with regional DISCOMs.' },
    { category: 'Billing', question: 'What payment modes are supported for solar subscription billing?', answer: 'We support all online payment modes including UPI, Net Banking, and major Debit/Credit Cards. Automated subscription payments can be set up in the customer panel.' },
    { category: 'Technical', question: 'What is the standard SLA for solar output degradation complaints?', answer: 'Standard technical troubleshooting and degradation SLA is 48 hours for dispatching a service technician to the site location.' },
];

const SupportFaq = () => {
    const [search, setSearch] = useState('');

    const filteredFaqs = MOCK_FAQS.filter(faq =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">FAQ & Help Center Management</h1>
                    <p className="text-neutral-500">Search standard support responses and policy templates.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search FAQ articles..."
                        className="px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFaqs.map((faq, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                                {faq.category}
                            </span>
                            <h3 className="font-bold text-neutral-800 text-lg">{faq.question}</h3>
                            <p className="text-neutral-500 leading-relaxed text-sm">{faq.answer}</p>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default SupportFaq;
