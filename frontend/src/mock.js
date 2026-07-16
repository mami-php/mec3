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
  eyebrow: 'YKS • LGS • MAARİF',
  titleGold: 'Koçum Sınav',
  titleWhite: 'İçerikleri!',
  subtitle:
    'Derece yapmış koçlar, uzman PDR danışmanları ve kişiye özel çalışma planlarıyla hedef sıralamana ulaş. Sınavını şansa bırakma; sürecini kontrol altına al.',
  primaryCta: 'Ücretsiz Tanıtım Görüşmesi',
  secondaryCta: 'Paketleri İncele',
  stats: [
    { value: '1.500+', label: 'Başarı Hikayesi' },
    { value: '40+', label: 'Uzman Koç' },
    { value: '%98', label: 'Memnuniyet' },
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

export const EXAM_TABS = ['YKS', 'LGS', 'Maarif', 'Ortaokul'];

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
  Maarif: [
    {
      name: 'Maarif Koçluk',
      subtitle: 'Yeni Müfredat Uyumlu',
      priceOld: '4.499',
      price: '2.999',
      unit: '₺ / 4 Hafta',
      features: [
        'MEB Müfredatına %100 Uyumlu',
        'Kişiye Özel Program',
        'Haftalık Görüşme',
        'App Erişimi',
      ],
      cta: 'Başla',
      accent: true,
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
  { name: 'Elif Aydın', role: 'YKS Derece Koçu • Tıp', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MjM3MDc1fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Mehmet Kaya', role: 'AYT Uzmanı • Boğaziçi Ünv.', img: 'https://images.unsplash.com/photo-1544168190-79c17527004f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHw0fHx1bml2ZXJzaXR5JTIwbWVudG9yfGVufDB8fHx8MTc4NDIzNzA2NXww&ixlib=rb-4.1.0&q=85' },
  { name: 'Zeynep Demir', role: 'Uzman PDR Danışmanı', img: 'https://images.unsplash.com/photo-1611695434369-a8f5d76ceb7b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MjM3MDc1fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Ahmet Yılmaz', role: 'TYT Koçu • ODTÜ', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3ODQyMzcwNjV8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'Selin Öz', role: 'LGS Koçu • Yıldız Teknik', img: 'https://images.unsplash.com/photo-1562337404-3044c84ac061?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MjM3MDc1fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Kaan Doğan', role: 'SAY Derece Koçu • Hacettepe Tıp', img: 'https://images.unsplash.com/photo-1627161683077-e34782c24d81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3ODQyMzcwNjV8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'Rabia Şahin', role: 'EA Koçu • İstanbul Hukuk', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MjM3MDY1fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Emre Polat', role: 'YKS Matematik Koçu', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg0MjM3MDY1fDA&ixlib=rb-4.1.0&q=85' },
];

export const SUCCESS_STORIES = [
  { name: 'Ahmet Yılmaz Kaya', field: 'SAY', rank: '10.847', tyt: '85 / 102', ayt: '57 / 74', dept: 'Moleküler Biyoloji ve Genetik', img: 'https://images.unsplash.com/photo-1607013407627-6ee814329547?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2Vzc3xlbnwwfHx8fDE3ODQyMzcxMTd8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'Mehmet Can Demir', field: 'SAY', rank: '98.652', tyt: '53 / 70', ayt: '35 / 52', dept: 'Mimarlık', img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwc3R1ZHlpbmd8ZW58MHx8fHwxNzg0MDg3OTA5fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Zeynep Nur Çelik', field: 'SÖZ', rank: '8.365', tyt: '60 / 85', ayt: '28 / 45', dept: 'Radyo, Televizyon ve Sinema', img: 'https://images.unsplash.com/photo-1593698054469-2bb6fdf4b512?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHw0fHxzdHVkZW50JTIwc3R1ZHlpbmd8ZW58MHx8fHwxNzg0MDg3OTA5fDA&ixlib=rb-4.1.0&q=85' },
  { name: 'Burak Öztürk', field: 'EA', rank: '2.154', tyt: '64 / 89', ayt: '45 / 64', dept: 'Hukuk', img: 'https://images.unsplash.com/photo-1624727828618-ee42ef2ec5cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxzdHVkZW50JTIwc3VjY2Vzc3xlbnwwfHx8fDE3ODQyMzcxMTd8MA&ixlib=rb-4.1.0&q=85' },
  { name: 'Merve Sena Doğan', field: 'EA', rank: '7.486', tyt: '60 / 79', ayt: '40 / 59', dept: 'Psikoloji', img: 'https://images.pexels.com/photos/4778660/pexels-photo-4778660.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { name: 'Kerem Arslan', field: 'SAY', rank: '4.315', tyt: '59 / 64', ayt: '35 / 50', dept: 'Beslenme ve Diyetetik', img: 'https://images.pexels.com/photos/7128661/pexels-photo-7128661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
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
    title: 'Ödeme & İade',
    items: [
      {
        q: '14 Gün %100 İade Garantisi nasıl işliyor?',
        a: 'Kayıt olduktan sonraki ilk 14 gün boyunca sistemi dener, koçunla görüşürsün. Bu sistem bana göre değil dersen, hiçbir kesinti veya şart olmadan ödemeni anında %100 iade ederiz.',
      },
      {
        q: 'Taksit imkanı bulunuyor mu?',
        a: 'Evet. Tüm paketlerimizde anlaşmalı kredi kartlarına vade farksız 9 taksit imkanımız bulunmaktadır.',
      },
      {
        q: 'Paketimi yükseltebilir miyim?',
        a: 'Tabii. Deneme Kulübü paketle başlayıp, dilediğin zaman aradaki farkı ödeyerek Koçluk paketlerine geçebilirsin.',
      },
      {
        q: 'Aboneliğim otomatik yenileniyor mu?',
        a: 'Aylık paketler otomatik yenilenir; ancak uygulama içindeki Aboneliğim menüsünden tek tıkla iptal edebilirsin.',
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
