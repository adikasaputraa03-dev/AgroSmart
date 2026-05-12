
// ========== SPLASH ==========
setTimeout(() => {
  const s = document.getElementById('splash');
  s.style.opacity = '0';
  setTimeout(() => s.style.display = 'none', 500);
}, 2200);

// ========== NAV ==========
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const tabs = ['home','kalkulator','unsur','analisis'];
  document.querySelectorAll('.nav-tab')[tabs.indexOf(id)].classList.add('active');
  window.scrollTo(0,0);
}

// ========== PLANT SELECT ==========
let selectedPlant = 'cabai';
function selectPlant(plant, el) {
  document.querySelectorAll('.plant-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedPlant = plant;
  document.getElementById('palawija-sub').style.display = plant === 'palawija' ? 'block' : 'none';
  document.getElementById('hasil-pupuk').classList.remove('show');
}

// ========== FERTILIZER DATA ==========
const pupukData = {
  cabai: {
    vegetatif: { urea:150, sp36:200, kcl:100, npk:300, organik:2000, za:100 },
    generatif: { urea:100, sp36:100, kcl:200, npk:400, organik:1000, za:50 },
    pemeliharaan: { urea:75, sp36:75, kcl:100, npk:200, organik:500, za:50 },
    catatan: 'Cabai sangat responsif terhadap K₂O untuk kualitas buah. Berikan Ca dan Mg ekstra untuk mencegah blossom end rot. Pupuk daun dengan unsur mikro direkomendasikan setiap 2 minggu.'
  },
  padi: {
    vegetatif: { urea:200, sp36:100, kcl:75, npk:250, organik:1500, za:0 },
    generatif: { urea:100, sp36:50, kcl:100, npk:200, organik:0, za:0 },
    pemeliharaan: { urea:100, sp36:50, kcl:50, npk:150, organik:500, za:0 },
    catatan: 'Padi sawah: Urea dibagi 3 aplikasi (15, 30, 45 HST). Gunakan metode pengairan berselang untuk efisiensi. Silika (Si) penting untuk ketegaran batang dan resistensi hama.'
  },
  jagung: {
    vegetatif: { urea:250, sp36:150, kcl:100, npk:350, organik:2500, za:0 },
    generatif: { urea:150, sp36:75, kcl:150, npk:300, organik:0, za:0 },
    pemeliharaan: { urea:100, sp36:50, kcl:75, npk:200, organik:500, za:0 },
    catatan: 'Jagung memerlukan N tinggi sepanjang musim. Lakukan side dressing Urea saat tanaman setinggi 30-40 cm. Kekurangan Zn sering terjadi pada jagung — tambahkan ZnSO₄ jika diperlukan.'
  },
  palawija: {
    vegetatif: { urea:75, sp36:150, kcl:75, npk:200, organik:2000, za:50 },
    generatif: { urea:50, sp36:75, kcl:100, npk:150, organik:500, za:50 },
    pemeliharaan: { urea:50, sp36:50, kcl:50, npk:100, organik:500, za:0 },
    catatan: 'Kedelai/kacang tanah: inokulasi Rhizobium untuk fiksasi N alami, kurangi Urea. Ubi kayu & ubi jalar: tingkatkan K untuk kualitas umbi. Hindari N berlebih yang memacu pertumbuhan daun.'
  }
};

const kondisiMult = { subur: 0.8, sedang: 1.0, kurang: 1.3 };
const phMult = { asam: 1.15, normal: 1.0, basa: 1.1 };
const satuanHa = 10000;

function hitungPupuk() {
  const luas = parseFloat(document.getElementById('luas').value) || 1000;
  const fase = document.getElementById('fase').value;
  const ph = document.getElementById('ph-tanah').value;
  const kondisi = document.getElementById('kondisi').value;
  const plant = selectedPlant;
  
  // Asumsi Jarak Tanam (m) untuk menghitung populasi
  const jarakTanam = {
    cabai: { x: 0.6, y: 0.5 },    // 60cm x 50cm
    padi: { x: 0.25, y: 0.25 },   // 25cm x 25cm (Legowo)
    jagung: { x: 0.75, y: 0.20 }, // 75cm x 20cm
    palawija: { x: 0.4, y: 0.2 }  // Rata-rata kedelai
  };

  const jt = jarakTanam[plant];
  const populasi = Math.floor(luas / (jt.x * jt.y));
  
  const data = pupukData[plant][fase];
  const multTotal = (luas / satuanHa) * kondisiMult[kondisi] * phMult[ph];

  const namaTanaman = { cabai:'🌶️ Cabai', padi:'🌾 Padi', jagung:'🌽 Jagung', palawija:'🥜 Palawija' };
  const namaFase = { vegetatif:'Fase Vegetatif', generatif:'Fase Generatif', pemeliharaan:'Pemeliharaan' };

  document.getElementById('tanaman-info').innerHTML = 
    `<strong>${namaTanaman[plant]}</strong> (${namaFase[fase]})<br>` +
    `Lahan: ${luas.toLocaleString('id')} m² | Est. Populasi: ${populasi.toLocaleString('id')} Tanaman`;

  const pupukNames = { urea:'Urea', sp36:'SP-36', kcl:'KCl', npk:'NPK', organik:'Organik', za:'ZA' };

  let gridHTML = '';
  for (const [k, v] of Object.entries(data)) {
    if (k !== 'catatan' && v > 0) {
      const totalGram = v * multTotal * 1000; // konversi ke gram
      const perTanaman = (totalGram / populasi).toFixed(2);
      
      gridHTML += `
        <div class="result-item" style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="ri-label">${pupukNames[k]}</div>
            <div class="ri-value">${totalGram >= 1000 ? (totalGram/1000).toFixed(2) : Math.round(totalGram)} <span class="ri-unit">${totalGram >= 1000 ? 'kg' : 'gram'}</span></div>
          </div>
          <div style="text-align: right; border-left: 1px solid rgba(255,255,255,0.2); padding-left: 15px;">
            <div class="ri-label">Per Tanaman</div>
            <div class="ri-value">${perTanaman} <span class="ri-unit">gram</span></div>
          </div>
        </div>`;
    }
  }
  
  document.getElementById('result-grid').innerHTML = gridHTML;
  document.getElementById('catatan-pupuk').innerHTML = '💡 ' + data.catatan;

  const box = document.getElementById('hasil-pupuk');
  box.classList.add('show');
  box.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

// ========== NUTRIENT DATA ==========
const nutrientData = [
  {
    id:'N', name:'Nitrogen', symbol:'N', group:'npk', type:'Makro Primer',
    fungsi:'Penyusun protein, klorofil, dan asam nukleat. Mendorong pertumbuhan vegetatif, warna hijau daun, dan pembentukan jaringan baru.',
    sumber:'Urea (46% N), ZA (21% N), Amonium nitrat, Pupuk kandang, Kompos',
    defisiensi:'Klorosis dimulai dari daun tua/bawah secara seragam. Daun bearwarna kuning pucat hingga kuning-hijau. Pertumbuhan terhambat, tanaman kerdil. Pada padi: daun menguning dari ujung ke pangkal.',
    gambar: 'unsur n.jpg',
    kelebihan:'Pertumbuhan vegetatif berlebih, tanaman mudah rebah, rentan hama penyakit, penundaan pematangan buah.'
  },
  {
    id:'P', name:'Fosfor', symbol:'P', group:'npk', type:'Makro Primer',
    fungsi:'Komponen ATP (energi), membran sel, dan DNA. Penting untuk perkembangan akar, pembungaan, pembentukan biji, dan pematangan buah.',
    sumber:'SP-36 (36% P₂O₅), TSP (46% P₂O₅), Rock phosphate, Pupuk organik terdekomposisi',
    defisiensi:'Daun tua berwarna ungu/kemerahan (antosianin menumpuk). Pertumbuhan akar terhambat. Pembungaan dan pembuahan terlambat. Tanaman tampak kaku dan kerdil.',
    gambar: 'unsur p.jpg',
    kelebihan:'Menginduksi defisiensi Zn, Fe, dan Mn karena antagonisme. Umumnya tidak beracun langsung pada tanaman.'
  },
  {
    id:'K', name:'Kalium', symbol:'K', group:'npk', type:'Makro Primer',
    fungsi:'Mengatur osmosis, membuka/menutup stomata, aktivator enzim, transportasi fotosintat, meningkatkan ketahanan terhadap stres dan penyakit, kualitas buah.',
    sumber:'KCl (60% K₂O), KNO₃ (44% K₂O), ZK (50% K₂O), Abu kayu, Pupuk organik',
    defisiensi:'Nekrosis (coklat/gosong) di tepi dan ujung daun tua. Daun tampak terbakar di bagian pinggir. Buah kecil, tidak seragam. Batang lemah. Pada cabai: buah mudah gugur.',
    gambar:'unsur k.jpg',
    kelebihan:'Menghambat penyerapan Mg dan Ca. Jarang terjadi di lahan pertanian normal.'
  },
  {
    id:'Ca', name:'Kalsium', symbol:'Ca', group:'makro', type:'Makro Sekunder',
    fungsi:'Pembentukan dinding sel, stabilisasi membran, aktivasi enzim, sinyal sel. Sangat penting untuk perkembangan akar dan buah yang sehat.',
    sumber:'Kapur (CaCO₃), Dolomit, Kalsium nitrat, Gipsum (CaSO₄), Superfosfat',
    defisiensi:'Kerusakan pada jaringan muda (meristematik). Ujung akar mati. Blossom end rot pada cabai/tomat. Tip burn pada selada/sawi. Daun muda keriting dan menggulung ke dalam.',
    gambar:'unsur ca.jpg',
    kelebihan:'Menaikkan pH tanah, mengganggu penyerapan Mg, K, dan Fe pada pH sangat tinggi.'
  },
  {
    id:'Mg', name:'Magnesium', symbol:'Mg', group:'makro', type:'Makro Sekunder',
    fungsi:'Inti molekul klorofil (1 atom Mg per klorofil). Aktivator lebih dari 300 enzim. Membantu translokasi P dan pembentukan minyak/lemak dalam biji.',
    sumber:'Dolomit (MgCO₃·CaCO₃), Kieserite (MgSO₄), Magnesium nitrat',
    defisiensi:'Klorosis interveinal pada daun tua — tulang daun tetap hijau sementara jaringan antar tulang menguning. Mirip defisiensi Fe tapi dimulai dari daun tua bukan muda.',
    gambar:'unsur mg.jpeg',
    kelebihan:'Jarang menimbulkan masalah langsung. Dapat mengganggu penyerapan Ca pada konsentrasi sangat tinggi.'
  },
  {
    id:'S', name:'Sulfur', symbol:'S', group:'makro', type:'Makro Sekunder',
    fungsi:'Komponen asam amino sistein dan metionin (protein). Penting untuk pembentukan klorofil, metabolisme N, dan aroma khas bawang/brassica.',
    sumber:'ZA (24% S), Gipsum (18% S), Belerang elementer, Pupuk kandang',
    defisiensi:'Klorosis merata pada daun muda (berbeda dari N yang mulai dari daun tua). Pertumbuhan terhambat. Pada bawang: umbi kecil dan kurang aroma.',
     gambar:'unsur s.jpg',
    kelebihan:'Menurunkan pH tanah. Konsentrasi tinggi dapat meracuni akar.'
  },
  {
    id:'Fe', name:'Besi', symbol:'Fe', group:'mikro', type:'Mikro',
    fungsi:'Pembentukan klorofil, komponen sitokrom dalam rantai transpor elektron, aktivasi enzim nitrogenase dan katalase.',
    sumber:'FeSO₄, Kelat besi (Fe-EDTA), Pupuk daun mengandung Fe',
    defisiensi:'Klorosis interveinal pada DAUN MUDA (berbeda dari Mg). Tulang daun tetap hijau, jaringan antar tulang kuning-putih. Sering terjadi pada tanah berkapur/pH tinggi.',
    kelebihan:'Keracunan Fe pada sawah tergenang: bercak coklat pada daun tua ("bronzing"), akar berwarna coklat.'
  },
  {
    id:'Mn', name:'Mangan', symbol:'Mn', group:'mikro', type:'Mikro',
    fungsi:'Aktivator enzim, berperan dalam fotosintesis (pelepasan O₂), reduksi nitrat, dan sintesis klorofil.',
    sumber:'MnSO₄, Pupuk daun, Pupuk organik',
    defisiensi:'Klorosis interveinal pada daun muda, mirip Fe tapi lebih ringan. Bercak nekrotik abu-abu/coklat tersebar di lamina daun. Sering pada tanah berpasir pH tinggi.',
    kelebihan:'Keracunan Mn sering pada tanah masam. Bercak coklat pada daun, mengganggu penyerapan Fe dan Mg.'
  },
  {
    id:'Zn', name:'Seng (Zinc)', symbol:'Zn', group:'mikro', type:'Mikro',
    fungsi:'Aktivator enzim karbohidrat dan protein, sintesis auksin (IAA), perkembangan biji dan buah, ketahanan penyakit.',
    sumber:'ZnSO₄, Pupuk daun, Pupuk chelat Zn',
    defisiensi:'Ruas batang memendek (roset). Daun muda kecil dan sempit. Klorosis bercak-bercak. Pada jagung: pita putih di tengah daun (white bud). Pada padi: kerdil beranak.',
    kelebihan:'Fitotoksik jika berlebih. Mengganggu penyerapan Fe dan Cu.'
  },
  {
    id:'Cu', name:'Tembaga', symbol:'Cu', group:'mikro', type:'Mikro',
    fungsi:'Komponen enzim oksidase, berperan dalam lignifikasi dinding sel, fotosintesis, dan metabolisme N.',
    sumber:'CuSO₄, Fungisida mengandung Cu (Bordeaux mixture)',
    defisiensi:'Daun muda layu dan menggulung. Ujung daun nekrotik. Batang lemah. Pada padi: "reclamation disease" — daun kebiruan lalu layu.',
    kelebihan:'Sangat toksik bagi tanaman dan organisme tanah pada konsentrasi tinggi. Mengganggu penyerapan Fe dan Zn.'
  },
  {
    id:'B', name:'Boron', symbol:'B', group:'mikro', type:'Mikro',
    fungsi:'Pembentukan dinding sel, perkecambahan serbuk sari, transportasi gula, perkembangan meristem, penyerapan kation.',
    sumber:'Boraks (Na₂B₄O₇), Pupuk daun mengandung B',
    defisiensi:'Meristem apikal mati (titik tumbuh mati). Bunga gugur. Buah dan biji tidak berkembang. Batang rapuh. Pada kubis: hollow stem. Pada cabai: blossom drop.',
    kelebihan:'Sangat toksik bahkan pada konsentrasi sedikit di atas kebutuhan. Tepi dan ujung daun terbakar (nekrosis).'
  },
  {
    id:'Mo', name:'Molibdenum', symbol:'Mo', group:'mikro', type:'Mikro',
    fungsi:'Komponen enzim nitrat reduktase (reduksi NO₃ ke NH₄). Penting untuk fiksasi N biologis oleh bakteri Rhizobium pada legum.',
    sumber:'Na-molibdat, Pupuk daun, Pupuk lengkap',
    defisiensi:'Klorosis umum pada daun tua mirip defisiensi N. Pada kubis/brassica: "whiptail" — lamina daun tidak berkembang sempurna, hanya tulang daun tersisa.',
    kelebihan:'Relatif tidak toksik bagi tanaman. Dapat menyebabkan molibdenosis pada ternak yang merumput di lahan tinggi Mo.'
  }
];

function renderNutrients(filter) {
  let filtered = nutrientData;
  if (filter === 'npk') filtered = nutrientData.filter(n => n.group === 'npk');
  else if (filter === 'makro') filtered = nutrientData.filter(n => n.group === 'makro');
  else if (filter === 'mikro') filtered = nutrientData.filter(n => n.group === 'mikro');
  else if (filter === 'defisiensi') filtered = nutrientData;

  const groupColors = { npk:'badge-npk', makro:'badge-macro', mikro:'badge-micro' };
  const borderColors = { npk:'', makro:'macro', mikro:'micro' };

  let html = '';
  if (filter === 'defisiensi') {
    html = '<div class="card" style="padding:12px 14px;"><div class="card-title"><span>🚨</span>Identifikasi dari Gejala</div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Daun Tua Menguning Merata</strong>→ Defisiensi <strong>Nitrogen (N)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Daun Muda Klorosis Interveinal</strong>→ Defisiensi <strong>Besi (Fe)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Daun Tua Klorosis Interveinal</strong>→ Defisiensi <strong>Magnesium (Mg)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Tepi Daun Nekrotik (Gosong)</strong>→ Defisiensi <strong>Kalium (K)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Warna Ungu/Merah pada Daun</strong>→ Defisiensi <strong>Fosfor (P)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Titik Tumbuh Mati, Bunga Gugur</strong>→ Defisiensi <strong>Boron (B)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Ruas Pendek, Daun Muda Kecil</strong>→ Defisiensi <strong>Seng/Zinc (Zn)</strong></div></div>';
    html += '<div class="tip-item"><div class="tip-icon">🍃</div><div class="tip-text"><strong>Buah Busuk Ujung (Blossom End Rot)</strong>→ Defisiensi <strong>Kalsium (Ca)</strong></div></div>';
    html += '</div>';
  }

  filtered.forEach(n => {
    const badgeClass = groupColors[n.group] || 'badge-npk';
    const borderClass = n.group === 'npk' ? '' : (n.group === 'makro' ? 'macro' : 'micro');
    const fotoHTML = n.img ? `<img src="${n.img}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:10px; border:1px solid #e8f0eb;">` : '';

    html += `<div class="nutrient-item ${borderClass}" onclick="toggleDetail('detail-${n.id}')">
      <div class="ni-header">
        <div>
          <div class="ni-name">${n.name}</div>
          <div class="ni-symbol">${n.symbol} · ${n.type}</div>
        </div>
        <span class="ni-badge ${badgeClass}">${n.type}</span>
      </div>
      <div class="ni-short">${n.fungsi.substring(0,90)}...</div>
      <div class="ni-detail" id="detail-${n.id}">
        ${fotoHTML} 
        <p><strong>Fungsi:</strong> ${n.fungsi}</p>
        <p><strong>Sumber Pupuk:</strong> ${n.sumber}</p>
        <div class="symptom">
          <div class="symptom-title">⚠️ Gejala Kekurangan</div>
          ${n.gambar ? 
      `<img src="assets/img/${n.gambar}" alt="Gejala kekurangan ${n.name}" 
        style="width:320px; height:180px; border-radius:10px; margin-top:10px; object-fit:cover;">` 
      : ''
    }
          <p>${n.defisiensi}</p>
        </div>
        </div>
    </div>`;
});
  document.getElementById('nutrient-list').innerHTML = html;
}

function toggleDetail(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

let currentNtab = 'semua';
function setNtab(filter, el) {
  if (el) {
    document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }
  currentNtab = filter;
  renderNutrients(filter);
}

renderNutrients('semua');

// ========== ANALYSIS ==========
function setAtab(id, el) {
  ['biaya','pendapatan','hasil'].forEach(t => {
    document.getElementById('atab-'+t).style.display = 'none';
  });
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  document.getElementById('atab-'+id).style.display = 'block';
  if (el) el.classList.add('active');
}

const defaultValues = {
  cabai:  { benih:600000, pupuk:2500000, pestisida:1500000, tk:5000000, olah:1500000, lain:500000, produksi:10000, harga:20000 },
  padi:   { benih:400000, pupuk:1800000, pestisida:600000, tk:3500000, olah:1200000, lain:400000, produksi:6000, harga:5500 },
  jagung: { benih:350000, pupuk:2000000, pestisida:500000, tk:3000000, olah:1000000, lain:300000, produksi:7000, harga:4500 },
  kedelai:{ benih:500000, pupuk:1500000, pestisida:800000, tk:3000000, olah:1000000, lain:300000, produksi:2000, harga:10000 }
};

function isiDefault() {
  const k = document.getElementById('a-komoditas').value;
  const d = defaultValues[k];
  if (d) {
    document.getElementById('a-benih').value = d.benih;
    document.getElementById('a-pupuk').value = d.pupuk;
    document.getElementById('a-pestisida').value = d.pestisida;
    document.getElementById('a-tk').value = d.tk;
    document.getElementById('a-olah').value = d.olah;
    document.getElementById('a-lain').value = d.lain;
    document.getElementById('a-produksi').value = d.produksi;
    document.getElementById('a-harga').value = d.harga;
  }
}

// Auto-fill defaults
document.getElementById('a-komoditas').addEventListener('change', () => {
  isiDefault();
});
isiDefault();

function hitungAnalisis() {
  const luas = parseFloat(document.getElementById('a-luas').value) || 1;
  const benih = parseFloat(document.getElementById('a-benih').value) || 0;
  const pupuk = parseFloat(document.getElementById('a-pupuk').value) || 0;
  const pestisida = parseFloat(document.getElementById('a-pestisida').value) || 0;
  const tk = parseFloat(document.getElementById('a-tk').value) || 0;
  const olah = parseFloat(document.getElementById('a-olah').value) || 0;
  const lain = parseFloat(document.getElementById('a-lain').value) || 0;
  const produksi = parseFloat(document.getElementById('a-produksi').value) || 0;
  const harga = parseFloat(document.getElementById('a-harga').value) || 0;
  const komoditas = document.getElementById('a-komoditas').value;

  const totalBiaya = (benih + pupuk + pestisida + tk + olah + lain) * luas;
  const totalPendapatan = produksi * harga * luas;
  const keuntungan = totalPendapatan - totalBiaya;
  const rcRatio = totalBiaya > 0 ? (totalPendapatan / totalBiaya).toFixed(2) : 0;
  const bep = produksi > 0 ? (totalBiaya / (produksi * luas)).toFixed(0) : 0;
  const roi = totalBiaya > 0 ? ((keuntungan / totalBiaya) * 100).toFixed(1) : 0;
  const rcBarWidth = Math.min(parseFloat(rcRatio) * 40, 100);
  const isProfit = keuntungan >= 0;

  const fmt = (n) => 'Rp ' + Math.abs(n).toLocaleString('id');
  const namaK = { cabai:'🌶️ Cabai Merah', padi:'🌾 Padi', jagung:'🌽 Jagung', kedelai:'🥜 Kedelai' };
  const kelayakan = parseFloat(rcRatio) >= 1.5 ? '✅ Sangat Layak' : parseFloat(rcRatio) >= 1.2 ? '✅ Layak' : parseFloat(rcRatio) >= 1.0 ? '⚠️ Impas' : '❌ Tidak Layak';

  document.getElementById('hasil-analisis').innerHTML = `
    <div class="card">
      <div class="card-title"><span>📊</span> ${namaK[komoditas]} · ${luas} Ha</div>

      <div class="cost-item"><span class="cost-label">💸 Total Biaya Produksi</span><span class="cost-value">${fmt(totalBiaya)}</span></div>
      <div class="cost-item"><span class="cost-label">📦 Total Produksi</span><span class="cost-value">${(produksi*luas).toLocaleString('id')} kg</span></div>
      <div class="cost-item"><span class="cost-label">💰 Total Pendapatan</span><span class="cost-value">${fmt(totalPendapatan)}</span></div>
      <div class="cost-item"><span class="cost-label">🏷️ BEP Harga</span><span class="cost-value">${fmt(parseInt(bep))}/kg</span></div>

      <div class="${isProfit ? 'profit-box profit-positive' : 'profit-box profit-negative'}" style="margin-top:12px;">
        <div class="profit-label">${isProfit ? '✅ Keuntungan Bersih' : '❌ Kerugian'}</div>
        <div class="profit-amount">${fmt(keuntungan)}</div>
        <div class="profit-sub">per musim · ${luas} Ha</div>
        <div class="rcm-ratio">
          <div style="font-size:11px; opacity:0.8; flex-shrink:0;">R/C Ratio</div>
          <div class="rcm-bar"><div class="rcm-bar-fill" style="width:${rcBarWidth}%"></div></div>
          <div class="rcm-text">${rcRatio}</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:12px;">
        <div style="flex:1; background:var(--bg); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">ROI</div>
          <div style="font-family:'Nunito'; font-size:22px; font-weight:900; color:var(--green-dark);">${roi}%</div>
        </div>
        <div style="flex:1; background:var(--bg); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Kelayakan</div>
          <div style="font-family:'Nunito'; font-size:14px; font-weight:800; color:var(--green-dark); margin-top:4px;">${kelayakan}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span>💡</span> Rekomendasi</div>
      ${parseFloat(rcRatio) < 1.2 ?
        `<div class="tip-item"><div class="tip-icon">🔴</div><div class="tip-text"><strong>Efisiensi Diperlukan</strong>Kurangi biaya tenaga kerja dengan mekanisasi. Pertimbangkan diversifikasi komoditas bernilai tinggi.</div></div>` : ''}
      <div class="tip-item">
        <div class="tip-icon">📈</div>
        <div class="tip-text"><strong>Tingkatkan Nilai Jual</strong>Pertimbangkan olahan pasca panen atau jual langsung ke konsumen (tanpa perantara) untuk margin lebih baik.</div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">🌱</div>
        <div class="tip-text"><strong>Optimalkan Input</strong>Gunakan pupuk organik untuk mengurangi biaya pupuk kimia jangka panjang sekaligus meningkatkan kesehatan tanah.</div>
      </div>
    </div>
  `;
}
