import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, { title: string, summary: string }>} */
const uk = {
  'vse-vrut': {
    title: 'УСІ БРЕХУТЬ',
    summary:
      '«Усі політики брешуть, та це не має значення, бо їм усе одно ніхто не вірить» — цей знаменитий афоризм належить харків\'янину, професору-екonomісту Є. Ліbermanу. Проте прославився наш з…',
  },
};

// Fix mistaken latin in template above when building - use pure Cyrillic below
uk['vse-vrut'].summary =
  '«Усі політики брешуть, та це не має значення, бо їм усе одно ніхто не вірить» — цей знаменитий афоризм належить харків\'янину, професору-екonomісту Є. Ліbermanу. Проте прославився наш з…';
