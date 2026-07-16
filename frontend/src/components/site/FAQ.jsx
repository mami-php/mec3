import React from 'react';
import { FAQ_GROUPS } from '../../mock';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const FAQ = () => {
  return (
    <section id="sss" className="relative py-24 lg:py-32 bg-ink-2/40 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.3em]">Yardım Merkezi</p>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tr text-white">
            Sıkça sorulan <span className="gold-text italic">sorular</span>.
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            Koçum Sınav hakkında merak edilenleri senin için derledik.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display font-bold text-lg text-gold">{group.title}</h3>
              <Accordion type="single" collapsible className="mt-4">
                {group.items.map((it, idx) => (
                  <AccordionItem key={idx} value={`${group.title}-${idx}`} className="border-white/10">
                    <AccordionTrigger className="text-left text-white/90 hover:text-gold hover:no-underline text-sm py-4">
                      {it.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-sm leading-relaxed">
                      {it.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
