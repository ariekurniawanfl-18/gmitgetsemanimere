import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ChurchData, MajelisMember, ChurchActivity, AnnouncementItem, FinancialWarta, ChurchRegistration, MediaItem } from './src/types';

// Read API keys safely
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize GoogleGenAI client lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getGenAIClient() {
  if (!aiClient) {
    if (!GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Corner will run in simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File path for persistent storage
const DATA_FILE = path.join(process.cwd(), 'church_data.json');

// Default initial data
const defaultData: ChurchData = {
  visimisi: {
    visi: "Terwujudnya Jemaat GMIT Getsemani Mere yang mandiri, misioner, inklusif, dan rukun demi kemuliaan Allah di wilayah Kec. Amarasi Barat.",
    misi: [
      "Meningkatkan persekutuan dan kerohanian jemaat melalui ibadah yang kudus, dinamis, serta pengajaran firman yang bersumber pada Alkitab.",
      "Kemandirian Teologi, Daya, dan Dana melalui pemberdayaan potensi ekonomi kreatif, talenta jemaat, dan pengelolaan persepuluhan/syukur secara transparan.",
      "Mengembangkan pelayanan sosial-kasih (diakonia) yang inklusif tanpa membedakan status sosial demi meringankan penderitaan sesama.",
      "Membina kerukunan oikumene serta toleransi hidup beragama di tengah masyarakat Kec. Amarasi Barat."
    ],
    motto: "Getsemani Bersemi: Bersyukur, Sehati, Melayani"
  },
  majelis: [
    {
      id: "m1",
      name: "......",
      role: "Ketua Majelis Jemaat Harian (KMJ)",
      phone: "+62 8.........",
      email: "......@gmail.com"
    },
    {
      id: "m2",
      name: "Pnt. ......",
      role: "Wakil Ketua Majelis Jemaat",
      phone: "+62 8........."
    },
    {
      id: "m3",
      name: "Pnt. ......",
      role: "Sekretaris Majelis Jemaat",
      phone: "+62 8........."
    },
    {
      id: "m4",
      name: "Dkn. ......",
      role: "Bendahara Majelis Jemaat",
      phone: "+62 8........."
    },
    {
      id: "m5",
      name: "Pnt. ......",
      role: "BP3J (Badan Pertimbangan & Pengawasan Pelayanan Jemaat)"
    },
    {
      id: "m6",
      name: "Pnt. ......",
      role: "BP4J (Badan Perencanaan, Penelitian, dan Pengembangan Pelayanan)"
    },
    {
      id: "m7",
      name: "Pnt. ......",
      role: "Ketua Unit Pembantu Pelayanan (UPP) ......"
    },
    {
      id: "m8",
      name: "Pnt. ......",
      role: "Koordinator Rayon I"
    },
    {
      id: "m9",
      name: "Pnt. ......",
      role: "Koordinator Rayon II"
    }
  ],
  activities: [
    {
      id: "act1",
      title: "Ibadah Minggu Utama - Rayon 1 & 2",
      dateTime: "Setiap Hari Minggu - Pukul 08:00 WITA",
      location: "Gedung GMIT Getsemani Mere",
      speaker: "Pdt. ......",
      description: "Ibadah persekutuan hari perhentian kudus bersama jemaat Rayon 1 (Pagi) dan Rayon 2 (Siang). Dilengkapi liturgi GMIT.",
      isRegularService: true
    },
    {
      id: "act2",
      title: "Ibadah Pemuda (Kategorial)",
      dateTime: "Setiap Hari Sabtu - Pukul 17:00 WITA",
      location: "Gedung GMIT Getsemani Mere",
      speaker: "Pengurus UPP Pemuda",
      description: "Persekutuan dan penguatan rohani bagi segenap generasi muda/pemuda-pemudi GMIT Getsemani Mere.",
      isRegularService: true
    },
    {
      id: "act3",
      title: "Ibadah Perempuan (Kategorial)",
      dateTime: "Setiap Hari Selasa - Pukul 15:30 WITA",
      location: "Tergilir di Rumah Jemaat Rayon I",
      speaker: "Pemain Liturgi & Pengkhotbah Rayon",
      description: "Persekutuan doa ibu-ibu dalam meningkatkan pilar iman dalam keluarga Kristen.",
      isRegularService: true
    },
    {
      id: "act4",
      title: "Ibadah Kaum Bapak (Kategorial)",
      dateTime: "Setiap Hari Kamis - Pukul 18:00 WITA",
      location: "Tergilir di Rumah Jemaat Rayon II",
      speaker: "Majelis Pendamping Kategorial",
      description: "Ibadah persekutuan kaum bapak guna memantapkan tugas iman sebagai kepala keluarga Kristen.",
      isRegularService: true
    },
    {
      id: "act5",
      title: "Persiapan Pelayan (Konsistori)",
      dateTime: "Setiap Hari Jumat - Pukul 19:15 WITA",
      location: "Gedung GMIT Getsemani Mere",
      speaker: "Pendamping Teologi / Ketua Majelis",
      description: "Persiapan dan penelaahan materi liturgi/khotbah bagi seluruh Pendeta, Penatua, dan Diaken yang bertugas pada ibadah hari Minggu.",
      isRegularService: false
    }
  ],
  announcements: [
    {
      id: "ann1",
      title: "Rapat Koordinasi Pelayanan Pentakosta Jemaat",
      content: "Mengundang seluruh Jemaat GMIT Getsemani Mere, khususnya para pengurus UPP dan koordinator rayon, untuk menghadiri rapat pleno koordinasi perayaan Pentakosta serta rancangan bakti sosial yang akan dipusatkan di Rayon II.",
      date: "2026-05-20",
      category: "Kegiatan"
    },
    {
      id: "ann2",
      title: "Pemanfaatan 'AI Corner' dalam Administrasi Warta",
      content: "Sebagai bagian dari pelayanan masa kini, jemaat meluncurkan 'AI Corner' di website resmi ini. Rubrik di bawah dapat digunakan oleh Majelis Jemaat Harian untuk mengalkulasi draf khotbah mingguan, struktur sidi, dan penyusunan draf warta jemaat secara digital.",
      date: "2026-05-19",
      category: "Pengumuman"
    },
    {
      id: "ann3",
      title: "Penerimaan Calon Katekisasi Kelas Baru (Sidi)",
      content: "Telah dibuka pendaftaran katekisasi kelas baru bagi anak-anak jemaat yang telah genap berusia 16 tahun ke atas atau yang akan meneguhkan iman (Sidi). Pendaftaran dapat dilakukan langsung secara online melalui menu Pengajuan Jemaat di portal ini.",
      date: "2026-05-18",
      category: "Berita"
    }
  ],
  financials: [
    {
      id: "fin1",
      title: "Persembahan Ibadah Minggu Utama Rayon 1",
      category: "Pemasukan",
      amount: 0,
      date: "2026-05-17",
      description: "Kantung Pemasukan persembahan ibadah kebaktian liturgi pagi Rayon I"
    },
    {
      id: "fin2",
      title: "Persembahan Ibadah Minggu Utama Rayon 2",
      category: "Pemasukan",
      amount: 0,
      date: "2026-05-17",
      description: "Kantung Pemasukan persembahan ibadah kebaktian liturgi siang Rayon II"
    },
    {
      id: "fin3",
      title: "Kolekte Syukur Persepuluhan Keluarga",
      category: "Pemasukan",
      amount: 0,
      date: "2026-05-16",
      description: "Persepuluhan bulanan keluarga penunjang kemandirian dana"
    },
    {
      id: "fin4",
      title: "Bantuan Sosial Diakonia Jemaat Terguncang Sakit",
      category: "Pengeluaran",
      amount: 0,
      date: "2026-05-19",
      description: "Pemberian dana kasih pelayanan diakonia bagi 3 kepala keluarga jemaat yang dirawat"
    },
    {
      id: "fin5",
      title: "Pembetulan Instalasi Genset & Listrik Altar",
      category: "Pengeluaran",
      amount: 0,
      date: "2026-05-18",
      description: "Servis genset cadangan gereja serta penggantian fitting listrik altar"
    }
  ],
  registrations: [
    {
      id: "reg1",
      type: "baptis",
      applicantName: "Yohanes Bani Jr.",
      phone: "081234567890",
      email: "yohanes.b@gmail.com",
      dateSubmitted: "2026-05-20",
      status: "Pending",
      formData: {
        namaLengkapAnak: "Yohanes Bani Jr.",
        tempatTanggalLahir: "Mere, 12 Bulan Januari 2026",
        namaAyah: "Pnt. Yulius Bani",
        namaIbu: "Agnes Bani-Kase",
        namaSaksiBaptis: "Pnt. Andreas Fallo, Sarah Leka"
      }
    },
    {
      id: "reg2",
      type: "sidi",
      applicantName: "Theresia Sunbanu",
      phone: "085338291022",
      email: "theresia.sun@gmail.com",
      dateSubmitted: "2026-05-19",
      status: "Pending",
      formData: {
        namaLengkap: "Theresia Sunbanu",
        tempatTanggalLahir: "Amarasi, 4 Juni 2009",
        alamatRayon: "Rayon II Mere",
        namaOrangTua: "Mathias Sunbanu"
      }
    }
  ],
  gallery: [
    {
      id: "gal1",
      title: "Gedung GMIT Getsemani Mere",
      imageUrl: "https://res.cloudinary.com/dhcquhxeu/image/upload/v1779355484/Screenshot_2_lbtg3d.jpg",
      type: "foto",
      description: "Gedung gereja sederhana yang berdiri megah melayani jemaat Mere, Kec. Amarasi Barat."
    },
    {
      id: "gal2",
      title: "Persekutuan Kebaktian Paduan Suara PART",
      imageUrl: "https://res.cloudinary.com/dhcquhxeu/image/upload/v1779355586/Screenshot_3_xxtjgf.jpg",
      type: "foto",
      description: "Kebaktian pujian paduan suara PART saat ibadah Paskah."
    },
    {
      id: "gal3",
      title: "Kunjungan Tim Misionaris Tamu",
      imageUrl: "https://res.cloudinary.com/dhcquhxeu/image/upload/v1779412417/unnamed_bi1kvi.jpg",
      type: "foto",
      description: "Kunjungan Tim Misionaris ke GMIT Getsemani Mere."
    }
  ]
};

// Ensure database file exists, otherwise write defaults
function loadChurchData(): ChurchData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const info = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(info);
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
  } catch (error) {
    console.error("Error loading church data file:", error);
    return defaultData;
  }
}

function saveChurchData(data: ChurchData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing church data:", err);
  }
}

// REST GET data endpoint
app.get('/api/church-data', (req, res) => {
  const data = loadChurchData();
  res.json(data);
});

// Admin login verification
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // A clean standard custom password for user trial
  if (password === 'getsemani' || password === '12345') {
    res.json({ success: true, token: 'session_token_getsemani_mere' });
  } else {
    res.status(401).json({ success: false, message: 'Sandi admin salah! Silakan coba lagi.' });
  }
});

// Update Visi-Misi
app.post('/api/church-data/visimisi', (req, res) => {
  const data = loadChurchData();
  const { visi, misi, motto } = req.body;
  if (visi) data.visimisi.visi = visi;
  if (misi) data.visimisi.misi = misi;
  if (motto) data.visimisi.motto = motto;
  saveChurchData(data);
  res.json({ success: true, data: data.visimisi });
});

// CRUD Majelis Members
app.post('/api/church-data/majelis', (req, res) => {
  const data = loadChurchData();
  const { id, name, role, phone, email } = req.body;
  if (id) {
    // Update
    const idx = data.majelis.findIndex(m => m.id === id);
    if (idx !== -1) {
      data.majelis[idx] = { ...data.majelis[idx], name, role, phone, email };
    }
  } else {
    // Create
    const newMember: MajelisMember = {
      id: 'm_' + Date.now(),
      name,
      role,
      phone,
      email
    };
    data.majelis.push(newMember);
  }
  saveChurchData(data);
  res.json({ success: true, data: data.majelis });
});

app.delete('/api/church-data/majelis/:id', (req, res) => {
  const data = loadChurchData();
  data.majelis = data.majelis.filter(m => m.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.majelis });
});

// CRUD Activities
app.post('/api/church-data/activities', (req, res) => {
  const data = loadChurchData();
  const { id, title, dateTime, location, speaker, description, isRegularService } = req.body;
  
  if (id) {
    const idx = data.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.activities[idx] = { ...data.activities[idx], title, dateTime, location, speaker, description, isRegularService };
    }
  } else {
    const newAct: ChurchActivity = {
      id: 'act_' + Date.now(),
      title,
      dateTime,
      location,
      speaker,
      description,
      isRegularService: !!isRegularService
    };
    data.activities.push(newAct);
  }
  saveChurchData(data);
  res.json({ success: true, data: data.activities });
});

app.delete('/api/church-data/activities/:id', (req, res) => {
  const data = loadChurchData();
  data.activities = data.activities.filter(a => a.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.activities });
});

// CRUD Announcements
app.post('/api/church-data/announcements', (req, res) => {
  const data = loadChurchData();
  const { id, title, content, date, category } = req.body;
  if (id) {
    const idx = data.announcements.findIndex(ann => ann.id === id);
    if (idx !== -1) {
      data.announcements[idx] = { ...data.announcements[idx], title, content, date, category };
    }
  } else {
    const newAnn: AnnouncementItem = {
      id: 'ann_' + Date.now(),
      title,
      content,
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'Pengumuman'
    };
    data.announcements.push(newAnn);
  }
  saveChurchData(data);
  res.json({ success: true, data: data.announcements });
});

app.delete('/api/church-data/announcements/:id', (req, res) => {
  const data = loadChurchData();
  data.announcements = data.announcements.filter(ann => ann.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.announcements });
});

// CRUD Financial Reports
app.post('/api/church-data/financials', (req, res) => {
  const data = loadChurchData();
  const { id, title, category, amount, date, description } = req.body;
  if (id) {
    const idx = data.financials.findIndex(f => f.id === id);
    if (idx !== -1) {
      data.financials[idx] = { ...data.financials[idx], title, category, amount: Number(amount), date, description };
    }
  } else {
    const newFin: FinancialWarta = {
      id: 'fin_' + Date.now(),
      title,
      category,
      amount: Number(amount),
      date: date || new Date().toISOString().split('T')[0],
      description
    };
    data.financials.push(newFin);
  }
  saveChurchData(data);
  res.json({ success: true, data: data.financials });
});

app.delete('/api/church-data/financials/:id', (req, res) => {
  const data = loadChurchData();
  data.financials = data.financials.filter(f => f.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.financials });
});

// Jemaat Form Registrations
app.post('/api/registrations', (req, res) => {
  const data = loadChurchData();
  const { type, applicantName, phone, email, formData } = req.body;
  
  if (!applicantName || !phone) {
    return res.status(400).json({ success: false, message: 'Nama dan nomor telepon pemohon wajib diisi!' });
  }

  const newReg: ChurchRegistration = {
    id: 'reg_' + Date.now(),
    type,
    applicantName,
    phone,
    email: email || '',
    dateSubmitted: new Date().toISOString().split('T')[0],
    status: 'Pending',
    formData: formData || {}
  };

  data.registrations.unshift(newReg);
  saveChurchData(data);
  res.json({ success: true, data: newReg });
});

// Admin approves registrations
app.post('/api/registrations/status', (req, res) => {
  const data = loadChurchData();
  const { id, status } = req.body; // 'Pending' | 'Disetujui' | 'Ditolak'
  const idx = data.registrations.findIndex(r => r.id === id);
  if (idx !== -1) {
    data.registrations[idx].status = status;
    saveChurchData(data);
    return res.json({ success: true, data: data.registrations[idx] });
  }
  res.status(404).json({ success: false, message: 'Registrasi tidak ditemukan!' });
});

app.delete('/api/registrations/:id', (req, res) => {
  const data = loadChurchData();
  data.registrations = data.registrations.filter(r => r.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.registrations });
});

// CRUD Gallery Media
app.post('/api/church-data/gallery', (req, res) => {
  const data = loadChurchData();
  const { id, title, imageUrl, type, description } = req.body;
  if (id) {
    const idx = data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      data.gallery[idx] = { ...data.gallery[idx], title, imageUrl, type, description };
    }
  } else {
    const newMedia: MediaItem = {
      id: 'gal_' + Date.now(),
      title,
      imageUrl: imageUrl || 'https://picsum.photos/seed/newmedia/800/600',
      type: type || 'foto',
      description
    };
    data.gallery.push(newMedia);
  }
  saveChurchData(data);
  res.json({ success: true, data: data.gallery });
});

app.delete('/api/church-data/gallery/:id', (req, res) => {
  const data = loadChurchData();
  data.gallery = data.gallery.filter(g => g.id !== req.params.id);
  saveChurchData(data);
  res.json({ success: true, data: data.gallery });
});

// AI Corner - Interactive helper using Gemini
app.post('/api/gemini/generate', async (req, res) => {
  const { prompt, type } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt tidak boleh kosong!' });
  }

  const aiClient = getGenAIClient();
  
  // Custom structured system guidance for Christian church activities
  const systemInstruction = 
    "Anda adalah asisten AI teologi untuk Presbiter/Majelis Gereja GMIT Getsemani Mere Kec. Amarasi Barat di Nusa Tenggara Timur (NTT). " +
    "Tugas Anda adalah menolong pelayan jemaat menyusun materi pelayanan (khotbah, pengumuman, warta, renungan). " +
    "Sentuhan bahasa harus ramah, sopan, berwibawa secara Kristen, bersesuaian dengan konteks jemaat GMIT (Gereja Masehi Injili di Timor). " +
    "Gunakan struktur yang rapi, ayat Alkitab pendukung yang relevan, serta sapaan gerejawi yang hangat ('Syalom', 'Saudara-saudari terkasih').";

  try {
    if (aiClient) {
      // Direct real call to the correct model 'gemini-3.5-flash' for Basic Text Tasks
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const generatedText = response.text || "Terjadi kesalahan dalam mendapatkan tanggapan asisten teologis.";
      res.json({ success: true, text: generatedText });
    } else {
      // Elegant, clean fully simulated fallback for local offline testing if no API key is specified yet
      console.log("No dynamic AI key, returning simulated theology outcome.");
      setTimeout(() => {
        let simulatedResponse = "";
        if (type === 'khotbah') {
          simulatedResponse = `### DRAF OUTLINE KHOTBAH MINGGUAN (SIMULASI)
**Tema:** Melayani dengan Hati yang Sehati (Getsemani Bersemi)
**Nas Pembimbing:** Filipi 2:1-4 (Satu hati, satu jiwa)

**I. Pendahuluan**
Syalom bapak, ibu, dan pemuda-pemudi di GMIT Getsemani Mere! Panggilan untuk sehati dan sepikir adalah draf penting teologis di wilayah Kec. Amarasi Barat. Di tengah kesibukan ladang dan pekerjaan, bagaimana kita tetap menjadi satu tubuh Kristus?

**II. Pokok-Pokok Pikiran**
1. **Rendah Hati Menghadirkan Kerukunan (Ayat 3)**: Menjauhkan kepentingan diri agar misi Kristus terwujud di rayon-rayon kita.
2. **Peduli pada Kepentingan Bersama (Ayat 4)**: Sebagaimana GMIT Getsemani Mere bangkit lewat program diakonia mandiri dan pemberdayaan jemaat.

**III. Penutup & Relevansi**
Mari menguatkan persekutuan jemaat kita, sehati, bersyukur, dan melayani. Amin.

---
*Catatan: Ini adalah draf simulasi teologis karena kunci API Gemini belum dikonfigurasi di tab Settings. Tambahkan kunci di tab Secrets untuk integrasi AI yang dinamis!*`;
        } else if (type === 'warta') {
          simulatedResponse = `### CONTOH SUNTIKAN BERITA WARTA JEMAAT MINGGUAN (SIMULASI)
**Kepada: Segenap Anggota Jemaat Rayon I & Rayon II**

1. **UCAPAN LIMPAH TERIMA KASIH**  
   Majelis Jemaat Harian GMIT Getsemani Mere mengucapkan terima kasih atas partisipasi aktif jemaat dalam ibadah minggu, persembahan persepuluhan, dan sumbangan sukarela diakonia sosial. Tuhan Yesus Pemilik Pelayanan memberkati usaha dan pekerjaan kita.

2. **PERSIAPAN KATEKISASI**  
   Diingatkan kepada seluruh orang tua anak kelas Sidi, pendaftaran administrasi baptis dan sidi telah dibuka online di website gereja. Mohon segera melengkapi draf di portal 'Pengajuan Jemaat'.

---
*Catatan: Ini adalah draf simulasi warta jemaat karena kunci API Gemini belum dikonfigurasi di tab Settings.*`;
        } else {
          simulatedResponse = `### ASISTEN PELAYANAN KRISTEN GMIT (SIMULASI)
Syalom! Draf usul Anda tentang "${prompt}" sangat bagus. 

**Rekomendasi Pelayanan Kristen:**
- Kaitkan selalu dengan program aksi nyata GMIT, seperti kepedulian sosial, ekologi (pemeliharaan tanah/tanaman di Amarasi Barat), dan penguatan persekutuan kategorial pemuda/ibu-bapak.
- Bacakan firman pembuka yang menguatkan jemaat di kebaktian Rayon.

---
*Catatan: Integrasikan GEMINI_API_KEY secara penuh di tab 'Secrets' untuk draf bertenaga AI yang interaktif sepenuhnya.*`;
        }
        res.json({ success: true, text: simulatedResponse });
      }, 800);
    }
  } catch (err: any) {
    console.error("Gemini invocation failed:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengontak asisten AI pada server. Pastikan API Key diatur secara memadai.',
      error: err.message 
    });
  }
});

// Configure Vite or Static Fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] GMIT Getsemani Mere backend running on http://localhost:${PORT}`);
  });
}

startServer();
