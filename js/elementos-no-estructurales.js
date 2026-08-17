// Calculadora de fuerza sísmica de diseño para elementos no estructurales
// NSR-10, Título A, Capítulo A.9 (ecuación A.9.4-1), con el espectro elástico de A.2.6.

(function () {
  const el = (id) => document.getElementById(id);

  const inputs = [
    'grupoUso', 'coefI', 'Aa', 'Av', 'Fa', 'Fv', 'hn', 'periodoT',
    'hx', 'Wp', 'tipoElemento', 'ap', 'Rp'
  ].reduce((acc, id) => {
    acc[id] = el(id);
    return acc;
  }, {});

  function fmt(n, decimals) {
    if (!isFinite(n)) return '-';
    return n.toFixed(decimals);
  }

  function espectroSa(T, Aa, Av, Fa, Fv, I) {
    const Tc = 0.48 * Av * Fv / (Aa * Fa);
    const TL = 2.4 * Fv;
    let Sa;
    if (T < Tc) {
      Sa = 2.5 * Aa * Fa * I;
    } else if (T <= TL) {
      Sa = 1.2 * Av * Fv * I / T;
    } else {
      Sa = 1.2 * Av * Fv * TL * I / (T * T);
    }
    return { Tc, TL, Sa };
  }

  function calcular() {
    const I = parseFloat(inputs.coefI.value) || 0;
    const Aa = parseFloat(inputs.Aa.value) || 0;
    const Av = parseFloat(inputs.Av.value) || 0;
    const Fa = parseFloat(inputs.Fa.value) || 0;
    const Fv = parseFloat(inputs.Fv.value) || 0;
    const hn = parseFloat(inputs.hn.value) || 0;
    const T = parseFloat(inputs.periodoT.value) || 0;
    const hx = parseFloat(inputs.hx.value) || 0;
    const Wp = parseFloat(inputs.Wp.value) || 0;
    const ap = parseFloat(inputs.ap.value) || 0;
    const Rp = parseFloat(inputs.Rp.value) || 0;

    if (Aa <= 0 || Av <= 0 || Fa <= 0 || Fv <= 0 || hn <= 0) {
      return;
    }

    const { Tc, TL, Sa } = espectroSa(T, Aa, Av, Fa, Fv, I);
    const As = Aa * Fa * I;
    const heq = 0.75 * hn;

    let ax;
    if (heq <= 0) {
      ax = Sa;
    } else if (hx <= heq) {
      ax = As + (Sa - As) * (hx / heq);
    } else {
      ax = Sa * (hx / heq);
    }

    const FpCalc = Rp > 0 ? (ax * ap * Wp / Rp) : NaN;
    const FpMin = I * Wp / 2;
    const FpFinal = Math.max(FpCalc, FpMin);
    const FpFinalKgf = FpFinal * 101.9716;

    el('outTc').textContent = fmt(Tc, 2);
    el('outTL').textContent = fmt(TL, 2);
    el('outAs').textContent = fmt(As, 3);
    el('outSa').textContent = fmt(Sa, 3);
    el('outHeq').textContent = fmt(heq, 2);
    el('outAx').textContent = fmt(ax, 3);
    el('outFpCalc').textContent = fmt(FpCalc, 2);
    el('outFpMin').textContent = fmt(FpMin, 2);
    el('outFpFinal').textContent = fmt(FpFinal, 2) + ' kN';
    el('outFpFinalKgf').textContent = '≈ ' + fmt(FpFinalKgf, 1) + ' kgf';
  }

  function onGrupoUsoChange() {
    const opt = inputs.grupoUso.options[inputs.grupoUso.selectedIndex];
    inputs.coefI.value = opt.value;
    el('desempenoMin').textContent = opt.getAttribute('data-desempeno');
    calcular();
  }

  function onTipoElementoChange() {
    const val = inputs.tipoElemento.value;
    const [ap, Rp] = val.split('|');
    inputs.ap.value = ap;
    inputs.Rp.value = Rp;
    calcular();
  }

  inputs.grupoUso.addEventListener('change', onGrupoUsoChange);
  inputs.tipoElemento.addEventListener('change', onTipoElementoChange);

  Object.keys(inputs).forEach((id) => {
    if (id === 'grupoUso' || id === 'tipoElemento' || id === 'coefI') return;
    inputs[id].addEventListener('input', calcular);
  });

  onGrupoUsoChange();
  onTipoElementoChange();
  calcular();
})();
