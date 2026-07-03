// ---- config ----
const CORRETOR_WHATSAPP = "5581999001008"; // (81) 99900-1008 em formato internacional
document.getElementById('corretorNome').textContent = "Equipe Dalton Costa";

// default date = today
document.querySelector('[name="data_proposta"]').valueAsDate = new Date();

// ---- cônjuge toggle ----
const temConjuge = document.getElementById('temConjuge');
const conjugeFields = document.getElementById('conjugeFields');
temConjuge.addEventListener('change', () => {
  conjugeFields.classList.toggle('show', temConjuge.checked);
  // section height changed, markers need to shift
  requestAnimationFrame(positionRail);
});

// ---- rail: numbered markers aligned to each section's own header ----
const sections = [...document.querySelectorAll('.card')];
const rail = document.getElementById('rail');
const line = document.createElement('div');
line.className = 'line';
rail.appendChild(line);

const floors = sections.map((sec, i) => {
  const el = document.createElement('div');
  el.className = 'floor';
  el.textContent = String(i + 1).padStart(2, '0');
  el.title = sec.dataset.title;
  el.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  rail.appendChild(el);
  return el;
});

function positionRail() {
  const railTop = rail.getBoundingClientRect().top + window.scrollY;
  const tops = sections.map(sec => {
    const head = sec.querySelector('.card-head');
    const target = head || sec;
    return (target.getBoundingClientRect().top + window.scrollY) - railTop;
  });
  floors.forEach((floor, i) => {
    floor.style.top = (tops[i] - 8) + 'px'; // align circle center with header text
  });
  line.style.top = tops[0] + 9 + 'px';
  line.style.height = Math.max(0, tops[tops.length - 1] - tops[0]) + 'px';
  // rail needs a real height so it isn't collapsed to 0 by the grid
  rail.style.minHeight = (tops[tops.length - 1] + 40) + 'px';
}

window.addEventListener('load', positionRail);
window.addEventListener('resize', positionRail);
// fonts loading can shift heights slightly after first paint
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionRail);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const idx = sections.indexOf(e.target);
    if (e.isIntersecting) {
      floors.forEach((f, i) => {
        f.classList.toggle('active', i === idx);
        f.classList.toggle('done', i < idx);
      });
    }
  });
}, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
sections.forEach(s => io.observe(s));

// ---- helpers ----
const form = document.getElementById('proposalForm');
const money = v => v ? `R$ ${v}` : '—';
const val = name => (form.elements[name] && form.elements[name].value.trim()) || '';

function buildMessage() {
  const incluiConjuge = temConjuge.checked;
  let lines = [];
  lines.push('*PROPOSTA DE COMPRA — Dalton Costa Imóveis*');
  lines.push('');
  lines.push('*Proponente*');
  lines.push(`Nome: ${val('nome') || '—'}`);
  lines.push(`CPF: ${val('cpf') || '—'}  RG: ${val('rg') || '—'} ${val('org_exp')}`);
  lines.push(`Estado civil: ${val('estado_civil') || '—'}  Nascimento: ${val('nascimento') || '—'}`);
  lines.push(`Naturalidade: ${val('natural_de') || '—'}  Nacionalidade: ${val('nacionalidade') || '—'}`);
  lines.push(`Profissão: ${val('profissao') || '—'}  Empresa: ${val('empresa') || '—'}  Renda: ${money(val('renda_mensal'))}`);
  lines.push(`Endereço residencial: ${val('end_residencial') || '—'}, ${val('bairro_res') || ''} — ${val('cidade_res') || ''}/${val('cep_res') || ''}`);
  lines.push(`Endereço comercial: ${val('end_comercial') || '—'}`);
  lines.push(`Contato: ${val('celular') || '—'} | Res: ${val('fone_res') || '—'} | Com: ${val('fone_com') || '—'}`);
  lines.push(`E-mail: ${val('email') || '—'}`);

  if (incluiConjuge) {
    lines.push('');
    lines.push('*Cônjuge / companheiro(a)*');
    lines.push(`Nome: ${val('c_nome') || '—'}`);
    lines.push(`CPF: ${val('c_cpf') || '—'}  RG: ${val('c_rg') || '—'} ${val('c_org_exp')}`);
    lines.push(`Estado civil: ${val('c_estado_civil') || '—'}  Nascimento: ${val('c_nascimento') || '—'}`);
    lines.push(`Naturalidade: ${val('c_natural_de') || '—'}  Nacionalidade: ${val('c_nacionalidade') || '—'}`);
    lines.push(`Profissão: ${val('c_profissao') || '—'}  Empresa: ${val('c_empresa') || '—'}  Renda: ${money(val('c_renda_mensal'))}`);
    lines.push(`Endereço comercial: ${val('c_end_comercial') || '—'}`);
    lines.push(`Contato: ${val('c_celular') || '—'} | Res: ${val('c_fone_res') || '—'} | Com: ${val('c_fone_com') || '—'}`);
    lines.push(`E-mail: ${val('c_email') || '—'}`);
  }

  lines.push('');
  lines.push('*Imóvel*');
  lines.push(`${val('imovel_nome') || '—'}${val('apartamento') ? ' — Unidade ' + val('apartamento') : ''}`);
  lines.push(`${val('imovel_endereco') || ''}, ${val('imovel_bairro') || ''} — ${val('imovel_cidade') || ''}/${val('imovel_uf') || ''}`);

  lines.push('');
  lines.push('*Condições de pagamento*');
  lines.push(`Valor do imóvel: ${money(val('valor_imovel'))}`);
  lines.push(`Sinal: ${money(val('sinal'))}`);
  if (val('financiamento_banco') || val('financiamento_valor')) {
    lines.push(`Financiamento: ${val('financiamento_banco') || '—'} — ${money(val('financiamento_valor'))}`);
  }
  if (val('forma_pagamento')) lines.push(`Forma de pagamento: ${val('forma_pagamento')}`);
  if (val('observacoes')) lines.push(`Observações: ${val('observacoes')}`);

  lines.push('');
  lines.push(`Local e data: ${val('local') || 'Recife'}, ${val('data_proposta') || '—'}`);
  lines.push('');
  lines.push('Declaro que as informações acima são verdadeiras, responsabilizando-me por sua exatidão.');

  return lines.join('\n');
}

function showStatus(msg, ok = true) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.className = 'status-msg ' + (ok ? 'ok' : 'err');
}

function validateCore() {
  const required = ['nome', 'cpf', 'celular', 'imovel_nome', 'valor_imovel'];
  const missing = required.filter(n => !val(n));
  if (missing.length) {
    showStatus('Preencha os campos obrigatórios (marcados com *) antes de enviar.', false);
    form.elements[missing[0]].focus();
    form.elements[missing[0]].closest('.card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  if (!document.getElementById('declaroCheck').checked) {
    showStatus('Confirme a declaração de veracidade das informações antes de enviar.', false);
    document.getElementById('declaroCheck').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

document.getElementById('btnWhatsapp').addEventListener('click', () => {
  if (!validateCore()) return;
  const text = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${CORRETOR_WHATSAPP}?text=${text}`, '_blank');
  showStatus('Proposta pronta! Confira e envie a mensagem que abrimos no WhatsApp.', true);
});

document.getElementById('btnPdf').addEventListener('click', () => {
  if (!validateCore()) return;
  window.print();
});
