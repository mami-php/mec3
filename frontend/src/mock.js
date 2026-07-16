// Mock data for Koçum Sınav

export const NAV_LINKS = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Koçluk', href: '#kocluk' },
  { label: 'Deneme Kulübü', href: '#deneme' },
  { label: 'Mentorlar', href: '#mentorlar' },
  { label: 'Başarılarımız', href: '#basari' },
  { label: 'S.S.S', href: '#sss' },
  { label: 'İletişim', href: '#iletisim' },
];

export const HERO = {
  eyebrow: 'YKS • LGS • KPSS',
  titleGold: 'Koçum Sınav',
  titleWhite: 'İçerikleri!',
  subtitle:
    'Derece yapmış koçlar, uzman PDR danışmanları ve kişiye özel çalışma planlarıyla hedef sıralamana ulaş. Sınavını şansa bırakma; sürecini kontrol altına al.',
  primaryCta: 'Ücretsiz Görüşme Planla',
  secondaryCta: 'Paketleri İncele',
  stats: [
    { value: '1.500+', label: 'Başarı Hikayesi' },
    { value: '40+', label: 'Uzman Koç' },
    { value: '%98', label: 'Memnuniyet' },
  ],
  badges: [
    { label: 'Birebir Koçluk', color: '#1a3a8a', text: '#ffffff', icon: 'Users' },
    { label: 'Kişisel Planlama', color: '#2f9d6f', text: '#ffffff', icon: 'CalendarClock' },
    { label: 'Deneme Kulübü', color: '#e05252', text: '#ffffff', icon: 'PackageOpen' },
    { label: 'Kamp Videoları', color: '#3aa1e0', text: '#ffffff', icon: 'MonitorPlay' },
    { label: 'Günlük Takip', color: '#e6b13a', text: '#0a1e3f', icon: 'MessageSquare' },
  ],
  championsTitle: 'YKS Şampiyonlarımız',
  champions: [
    { name: 'Ahmet Eren Özyurtseven', rank: 'YKS’de 1.', img: 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=600&h=800&fit=crop&crop=faces&q=80' },
    { name: 'Zeynep Sude Öztürk', rank: 'YKS’de 1906.', img: 'https://images.unsplash.com/photo-1612203304476-2ed23c55b5b9?w=600&h=800&fit=crop&crop=faces&q=80' },
    { name: 'Beril Özer', rank: 'YKS’de 1700.', img: 'https://images.unsplash.com/photo-1526342189144-aa78e49e68b4?w=600&h=800&fit=crop&crop=faces&q=80' },
    { name: 'Akif Uyaroğlu', rank: 'YKS’de 1029.', img: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&h=800&fit=crop&crop=faces&q=80' },
    { name: 'Ebrar Metin', rank: 'YKS’de 1119.', img: 'https://images.unsplash.com/photo-1781705117078-dbd54fd9f597?w=600&h=800&fit=crop&crop=faces&q=80' },
  ],
};

export const TRUST_LOGOS = [
  'Karekök', 'Paraf', 'Orijinal', 'Miray', 'ÜçDörtBeş', 'Acil', 'Bilgi Sarmal', 'Apotemi', 'ENS Yayınları', 'Aktif Öğrenme',
];

export const FEATURES = [
  {
    title: 'Birebir Koçluk',
    desc: 'Sana özel derece koçu veya uzman PDR ile haftada 2 canlı görüşme ve sınırsız mesajlaşma.',
    icon: 'UserCheck',
  },
  {
    title: 'Günlük Takip',
    desc: 'Uygulama üzerinden her günün planı, çalışma süresi ve çözülen soru sayısı şeffafça takip edilir.',
    icon: 'Activity',
  },
  {
    title: 'Kişisel Planlama',
    desc: 'Hedefine, seviyene ve öğrenme stiline göre haftalık çalışma programı sana özel hazırlanır.',
    icon: 'CalendarClock',
  },
  {
    title: 'Konu Takibi',
    desc: 'Eksik konular tespit edilir, tekrar döngüleri kurulur, hiçbir konu boşlukta kalmaz.',
    icon: 'BookOpenCheck',
  },
  {
    title: 'Deneme Kulübü',
    desc: 'En kaliteli yayınevlerinin denemeleri adrese kargo, video çözümler ve detaylı analiz karnesi.',
    icon: 'ClipboardList',
  },
  {
    title: 'Veli Bilgilendirme',
    desc: 'Ayda 1 veli görüşmesi, düzenli SMS raporları ve şeffaf gelişim grafiği.',
    icon: 'Users',
  },
];

export const EXAM_TABS = ['YKS', 'LGS', 'KPSS', 'Ortaokul'];

export const PACKAGES = {
  YKS: [
    {
      badge: 'En Popüler',
      name: 'YKS Bire Bir Koçluk',
      subtitle: '4 Hafta • Erken Kayıt',
      priceOld: '5.200',
      price: '3.550',
      unit: '₺ / 4 Hafta',
      features: [
        'Sana Özel Derece Koçu veya Uzman PDR',
        'Sana Özel Günlük Program',
        'Haftada 2 Canlı Görüşme',
        'Koçunla Sınırsız Mesajlaşma',
        'Ayda 1 Veli Görüşmesi',
        'Koçum Sınav App Erişimi',
      ],
      cta: 'Koçluk Başlat',
      accent: true,
    },
    {
      name: 'YKS Deneme Kulübü',
      subtitle: '4 Hafta Boyunca',
      priceOld: '1.499',
      price: '999',
      unit: '₺ / 4 Hafta',
      features: [
        'Adrese Kargo 4 TYT Denemesi',
        'Her Deneme İçin Detaylı Analiz Karnesi',
        'Her Deneme İçin Video Çözümler',
        'Online Gözetmen',
        'Baykuşlulara Özel Videolar',
        'Koçum Sınav App Erişimi',
      ],
      cta: 'Deneme Kulübüne Katıl',
      accent: false,
    },
    {
      badge: 'Avantaj Paketi',
      name: 'YKS Koçluk + Deneme',
      subtitle: 'Tam Kombo Paket',
      priceOld: '6.699',
      price: '4.299',
      unit: '₺ / 4 Hafta',
      features: [
        'Sana Özel Derece Koçu / PDR',
        'Adrese Kargo 4 TYT Denemesi',
        'Sana Özel Günlük Program',
        'Haftada 2 Canlı Görüşme',
        'Her Deneme İçin Analiz Karnesi',
        'Video Çözümler + Sınırsız Mesajlaşma',
      ],
      cta: 'Avantajlı Paketi Al',
      accent: false,
    },
  ],
  LGS: [
    {
      name: 'LGS Bire Bir Koçluk',
      subtitle: '4 Hafta',
      priceOld: '4.100',
      price: '2.899',
      unit: '₺ / 4 Hafta',
      features: [
        'LGS Uzmanı Koç',
        'Haftalık Canlı Görüşme',
        'Kişisel Program',
        'Veli Raporu',
        'App Erişimi',
      ],
      cta: 'Koçluk Başlat',
      accent: true,
    },
    {
      name: 'LGS Deneme Kulübü',
      subtitle: 'Aylık',
      priceOld: '1.299',
      price: '849',
      unit: '₺ / 4 Hafta',
      features: [
        '4 LGS Denemesi',
        'Adrese Kargo',
        'Video Çözümler',
        'Analiz Karnesi',
      ],
      cta: 'Kulübe Katıl',
      accent: false,
    },
    {
      name: 'LGS Kombo',
      subtitle: 'Koçluk + Deneme',
      priceOld: '5.399',
      price: '3.499',
      unit: '₺ / 4 Hafta',
      features: [
        'Kişisel LGS Koçu',
        '4 LGS Denemesi + Video Çözüm',
        'Analiz Karnesi',
        'Sınırsız Mesajlaşma',
        'Veli Bilgilendirme',
      ],
      cta: 'Avantajlı Paketi Al',
      accent: false,
    },
  ],
  KPSS: [
    {
      name: 'KPSS Bire Bir Koçluk',
      subtitle: 'Genel Yetenek + Genel Kültür',
      priceOld: '5.999',
      price: '3.999',
      unit: '₺ / 4 Hafta',
      features: [
        'Sınav Uzmanı Koç',
        'Haftalık Canlı Görüşme',
        'Kişisel Çalışma Programı',
        'Deneme Analizi',
        'App Erişimi',
      ],
      cta: 'Koçluk Başlat',
      accent: true,
    },
    {
      name: 'KPSS Deneme Kulübü',
      subtitle: 'Aylık',
      priceOld: '1.699',
      price: '1.199',
      unit: '₺ / 4 Hafta',
      features: [
        '6 Genel Deneme',
        'Video Çözümler',
        'Detaylı Net Analizi',
        'App Erişimi',
      ],
      cta: 'Kulübe Katıl',
      accent: false,
    },
    {
      name: 'KPSS Kombo',
      subtitle: 'Koçluk + Deneme',
      priceOld: '7.199',
      price: '4.699',
      unit: '₺ / 4 Hafta',
      features: [
        'Kişisel KPSS Koçu',
        '6 KPSS Denemesi + Video Çözüm',
        'Sınırsız Mesajlaşma',
        'Detaylı Analiz Karnesi',
        'Öğretmenlik / A Grubu Odaklı',
      ],
      cta: 'Avantajlı Paketi Al',
      accent: false,
    },
  ],
  Ortaokul: [
    {
      name: 'Ortaokul Rehberlik',
      subtitle: '5-6-7. Sınıflar',
      priceOld: '2.499',
      price: '1.699',
      unit: '₺ / 4 Hafta',
      features: [
        'Öğrenme Stili Analizi',
        'Kişisel Program',
        'Veli Rehberliği',
        'Etüt Planı',
      ],
      cta: 'Başla',
      accent: true,
    },
  ],
};

export const MENTORS = [
  { name: 'Elif Aydın', role: 'YKS Derece Koçu • Tıp', img: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Mehmet Kaya', role: 'AYT Uzmanı • Boğaziçi Ünv.', img: 'https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Zeynep Demir', role: 'Uzman PDR Danışmanı', img: 'https://images.unsplash.com/photo-1613299469603-6e629423af83?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Ahmet Yılmaz', role: 'TYT Koçu • ODTÜ', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Selin Öz', role: 'LGS Koçu • Yıldız Teknik', img: 'https://images.unsplash.com/photo-1526342189144-aa78e49e68b4?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Kaan Doğan', role: 'SAY Derece Koçu • Hacettepe Tıp', img: 'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Rabia Şahin', role: 'EA Koçu • İstanbul Hukuk', img: 'https://images.unsplash.com/photo-1612203304476-2ed23c55b5b9?w=600&h=800&fit=crop&crop=faces&q=80' },
  { name: 'Emre Polat', role: 'YKS Matematik Koçu', img: 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=600&h=800&fit=crop&crop=faces&q=80' },
];

export const SUCCESS_STORIES = [
  { name: 'Ahmet Yılmaz Kaya', field: 'SAY', rank: '10.847', tyt: '85 / 102', ayt: '57 / 74', dept: 'Moleküler Biyoloji ve Genetik', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&crop=faces&q=80' },
  { name: 'Mehmet Can Demir', field: 'SAY', rank: '98.652', tyt: '53 / 70', ayt: '35 / 52', dept: 'Mimarlık', img: 'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=800&h=1000&fit=crop&crop=faces&q=80' },
  { name: 'Zeynep Nur Çelik', field: 'SÖZ', rank: '8.365', tyt: '60 / 85', ayt: '28 / 45', dept: 'Radyo, Televizyon ve Sinema', img: 'https://images.unsplash.com/photo-1740512380326-12ea7fc64c53?w=800&h=1000&fit=crop&crop=faces&q=80' },
  { name: 'Burak Öztürk', field: 'EA', rank: '2.154', tyt: '64 / 89', ayt: '45 / 64', dept: 'Hukuk', img: 'https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?w=800&h=1000&fit=crop&crop=faces&q=80' },
  { name: 'Merve Sena Doğan', field: 'EA', rank: '7.486', tyt: '60 / 79', ayt: '40 / 59', dept: 'Psikoloji', img: 'https://images.unsplash.com/photo-1613299469603-6e629423af83?w=800&h=1000&fit=crop&crop=faces&q=80' },
  { name: 'Kerem Arslan', field: 'SAY', rank: '4.315', tyt: '59 / 64', ayt: '35 / 50', dept: 'Beslenme ve Diyetetik', img: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=800&h=1000&fit=crop&crop=faces&q=80' },
];

export const TESTIMONIALS = [
  {
    name: 'Zeynep Kaya',
    role: 'Öğrenci • YKS 2024',
    text:
      'Koçum Sınav\'a başlamadan önce masaya oturup ne çalışacağımı düşünmekten 1 saatim gidiyordu. Şimdi her şey programlı, tıkır tıkır işliyor. Haftalık ne yapacağım belli olunca sadece masaya oturmak kalıyor.',
    rating: 5,
  },
  {
    name: 'Sevgi Yılmaz',
    role: 'Veli',
    text:
      'Çalışan bir anne olarak oğlumun durumunu takip etmekte çok zorlanıyordum. Koçum Sınav sayesinde telefondan haftalık raporları görebiliyor, içim rahat ediyor. Emeği geçen herkese teşekkürler.',
    rating: 5,
  },
  {
    name: 'Emirhan Demir',
    role: 'Mezun • YKS 1119.',
    text:
      'Mezun senesi çok yıpratıcı bir süreç. Tek başıma yapamam diyip Koçum Sınav ile tanıştım. Sadece ders değil psikolojik olarak da inanılmaz destek sağladılar. Her seferinde beni ayağa kaldırdılar.',
    rating: 5,
  },
  {
    name: 'Büşra Şahin',
    role: 'Öğrenci',
    text:
      'Deneme netlerim aylardır yerinde sayıyordu, 2 ayda uçtu. Programlama ve analiz taktikleri cidden işe yarıyor. Çok iyi bir sistem, herkese tavsiye ederim.',
    rating: 5,
  },
  {
    name: 'Ceren Arslan',
    role: 'Öğrenci',
    text:
      'Benim için sadece bir rehberlik kurumu değil, gerçek bir destek oldular. Sadece netlerimi değil, uyku düzenimi, sınav stresimi bile beraber yönetiyoruz. Normal bir dershaneden çok daha fazlası.',
    rating: 5,
  },
  {
    name: 'Murat Aydın',
    role: 'Veli',
    text:
      'Kızımın motivasyonu çok düşmüştü, Koçum Sınav ekibi sayesinde toparladı. Koçu o kadar ilgili ki sanki kendi kardeşi sınava hazırlanıyor gibi üstüne düşüyor. Kesinlikle tavsiye ederim.',
    rating: 5,
  },
];

export const FAQ_GROUPS = [
  {
    title: 'Koçluk Sistemi',
    items: [
      {
        q: 'Koçumu ben mi seçiyorum, sistem mi atıyor?',
        a: 'Rastgele atama yoktur. Sana ve koçlarımıza uyguladığımız detaylı kişilik analizi sonucunda hedeflerine ve öğrenme stiline en uygun koçları karşına çıkarıyoruz. Bu koçlar arasından seçim sen yapıyorsun.',
      },
      {
        q: 'Koçumla sadece haftada bir mi iletişim kurabilirim?',
        a: 'Hayır. Haftalık planlı görüntülü görüşmelerimizin yanı sıra, Koçum Sınav uygulaması içinden koçunla kesintisiz iletişimde kalabilirsin.',
      },
      {
        q: 'Programlarda sadece çözülecek testler mi yer alıyor?',
        a: 'Hayır. Bir gün içinde yapman gereken bütün çalışmalar en küçük ayrıntısına kadar koçun tarafından planlanıyor. Sen sadece uygulamaya girip planı tamamlıyorsun.',
      },
      {
        q: 'Koçumu değiştirebilir miyim?',
        a: 'Kesinlikle. Uyum yakalayamadığını hissedersen sistem üzerinden koç değişikliği talep edebilirsin.',
      },
    ],
  },
  {
    title: 'Veli & Takip',
    items: [
      {
        q: 'Bir veli olarak gelişimi nasıl takip ederim?',
        a: 'Destekleyici Veli modelini kurguluyoruz. Düzenli SMS bilgilendirmeleriyle deneme analizlerini, koç değerlendirmelerini ve gelişim grafiğini şeffaf bir şekilde paylaşıyoruz.',
      },
      {
        q: 'Sadece ders çalışıp çalışmadığını mı takip ediyorsunuz?',
        a: 'Hayır. Eksik konuları tespit eder, ekran süresi ve okuma alışkanlığı üzerine de takip yaparız.',
      },
    ],
  },
];

export const FOOTER = {
  brand: 'Koçum Sınav',
  tagline: 'Koçum Sınav\'la hazır ol, fark yarat.',
  columns: [
    {
      title: 'Ürünler',
      links: ['YKS Koçluk', 'LGS Koçluk', 'Deneme Kulübü', 'Maarif Programı', 'Full Tekrar'],
    },
    {
      title: 'Kurumsal',
      links: ['Hakkımızda', 'Mentorlar', 'Başarılarımız', 'Blog', 'Kariyer'],
    },
    {
      title: 'Destek',
      links: ['Aboneliğimi Yönet', 'İptal & İade', 'KVKK', 'Mesafeli Satış', 'Bize Ulaşın'],
    },
  ],
  contact: {
    phone: '0 850 000 00 00',
    email: 'destek@kocumsinav.com',
    address: 'İstanbul, Türkiye',
  },
};
