// prisma/seed.ts
// ──────────────────────────────────────────────────────────────────
// Development seeder — wipes ALL data then re-seeds with demo data.
// Run:  npx prisma db seed
// ──────────────────────────────────────────────────────────────────

import { PrismaClient, Role, TxType, PaymentStatus, AchievementType, AchievementLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123';

// ─── Helpers ──────────────────────────────────────────────────────

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

function randomScore(): number {
  return Math.round((60 + Math.random() * 40) * 10) / 10; // 60.0 – 100.0
}

// ─── Main seed function ──────────────────────────────────────────

async function main() {
  console.log('🗑️  Wiping existing data …');

  // Delete in FK-safe order (children first)
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.progressScore.deleteMany();
  await prisma.treasuryTransaction.deleteMany();
  await prisma.paymentSubmission.deleteMany();
  await prisma.paymentBill.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.extracurricular.deleteMany();
  await prisma.studentOrganization.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.schoolOrg.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅  Database wiped');

  // ── Hash passwords ──────────────────────────────────────────────
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ══════════════════════════════════════════════════════════════════
  //  1. USERS
  // ══════════════════════════════════════════════════════════════════
  console.log('👤  Creating users …');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@askala.id',
      password: hash,
      firstName: 'Budi',
      lastName: 'Santoso',
      phone: '081234567890',
      role: Role.ADMIN,
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      email: 'guru@askala.id',
      password: hash,
      firstName: 'Siti',
      lastName: 'Rahmawati',
      phone: '081234567891',
      role: Role.TEACHER,
    },
  });

  const parentUser = await prisma.user.create({
    data: {
      email: 'ortu@askala.id',
      password: hash,
      firstName: 'Ahmad',
      lastName: 'Wijaya',
      phone: '081234567892',
      role: Role.PARENT,
    },
  });

  // Student users (5 students)
  const studentNames = [
    { firstName: 'Rina', lastName: 'Wijaya', email: 'rina@askala.id' },
    { firstName: 'Dimas', lastName: 'Pratama', email: 'dimas@askala.id' },
    { firstName: 'Putri', lastName: 'Ayu', email: 'putri@askala.id' },
    { firstName: 'Fajar', lastName: 'Kurniawan', email: 'fajar@askala.id' },
    { firstName: 'Nadia', lastName: 'Safitri', email: 'nadia@askala.id' },
  ];

  const studentUsers: Awaited<ReturnType<typeof prisma.user.create>>[] = [];
  for (const s of studentNames) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        password: hash,
        firstName: s.firstName,
        lastName: s.lastName,
        phone: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: Role.STUDENT,
      },
    });
    studentUsers.push(user);
  }

  // ══════════════════════════════════════════════════════════════════
  //  2. ROLE PROFILES
  // ══════════════════════════════════════════════════════════════════
  console.log('📋  Creating role profiles …');

  const adminProfile = await prisma.adminProfile.create({
    data: { userId: adminUser.id, position: 'Kepala Sekolah' },
  });

  const parentProfile = await prisma.parent.create({
    data: { userId: parentUser.id },
  });

  // Student profiles
  const classRooms = ['X-IPA 1', 'X-IPS 1', 'XI-IPA 2', 'XI-IPS 1', 'XII-IPA 1'];
  const majors = ['IPA', 'IPS', 'IPA', 'IPS', 'IPA'];
  const grades = ['X', 'X', 'XI', 'XI', 'XII'];

  const students: Awaited<ReturnType<typeof prisma.student.create>>[] = [];
  for (let i = 0; i < studentUsers.length; i++) {
    const student = await prisma.student.create({
      data: {
        nis: `2024${String(i + 1).padStart(4, '0')}`,
        classRoom: classRooms[i],
        major: majors[i],
        grade: grades[i],
        userId: studentUsers[i].id,
        parentId: i === 0 ? parentProfile.id : null, // Rina is Ahmad's child
      },
    });
    students.push(student);
  }

  // ══════════════════════════════════════════════════════════════════
  //  3. SCHOOL ORGANIZATIONS
  // ══════════════════════════════════════════════════════════════════
  console.log('🏫  Creating organizations …');

  const orgsData = [
    { name: 'OSIS', description: 'Organisasi Siswa Intra Sekolah' },
    { name: 'Pramuka', description: 'Gerakan Pramuka sekolah' },
    { name: 'PMR', description: 'Palang Merah Remaja' },
    { name: 'KIR', description: 'Kelompok Ilmiah Remaja' },
    { name: 'Paskibra', description: 'Pasukan Pengibar Bendera' },
  ];

  const orgs: Awaited<ReturnType<typeof prisma.schoolOrg.create>>[] = [];
  for (const o of orgsData) {
    const org = await prisma.schoolOrg.create({
      data: { name: o.name, description: o.description, isActive: true },
    });
    orgs.push(org);
  }

  // ══════════════════════════════════════════════════════════════════
  //  4. STUDENT ↔ ORGANIZATION (many-to-many)
  // ══════════════════════════════════════════════════════════════════
  console.log('🔗  Linking students to organizations …');

  const studentOrgAssignments = [
    { studentIdx: 0, orgIdx: 0, role: 'Ketua' },     // Rina → OSIS Ketua
    { studentIdx: 0, orgIdx: 3, role: 'Anggota' },    // Rina → KIR Anggota
    { studentIdx: 1, orgIdx: 0, role: 'Sekretaris' }, // Dimas → OSIS Sekretaris
    { studentIdx: 1, orgIdx: 1, role: 'Anggota' },    // Dimas → Pramuka
    { studentIdx: 2, orgIdx: 2, role: 'Ketua' },      // Putri → PMR Ketua
    { studentIdx: 3, orgIdx: 4, role: 'Anggota' },    // Fajar → Paskibra
    { studentIdx: 4, orgIdx: 1, role: 'Anggota' },    // Nadia → Pramuka
    { studentIdx: 4, orgIdx: 3, role: 'Ketua' },      // Nadia → KIR Ketua
  ];

  for (const so of studentOrgAssignments) {
    await prisma.studentOrganization.create({
      data: {
        studentId: students[so.studentIdx].id,
        orgId: orgs[so.orgIdx].id,
        role: so.role,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  5. ACHIEVEMENTS
  // ══════════════════════════════════════════════════════════════════
  console.log('🏆  Creating achievements …');

  const achievementsData = [
    {
      title: 'Juara 1 Olimpiade Matematika',
      type: AchievementType.AKADEMIK,
      level: AchievementLevel.PROVINSI,
      position: 'Juara 1',
      organizer: 'Dinas Pendidikan Jawa Timur',
      studentIdx: 0,
      daysAgo: 30,
      isVerified: true,
    },
    {
      title: 'Medali Emas Olimpiade Fisika',
      type: AchievementType.AKADEMIK,
      level: AchievementLevel.NASIONAL,
      position: 'Medali Emas',
      organizer: 'Kementerian Pendidikan RI',
      studentIdx: 0,
      daysAgo: 15,
      isVerified: true,
    },
    {
      title: 'Juara 2 Lomba Debat Bahasa Inggris',
      type: AchievementType.AKADEMIK,
      level: AchievementLevel.KABUPATEN,
      position: 'Juara 2',
      organizer: 'MGMP Bahasa Inggris Kab. Malang',
      studentIdx: 1,
      daysAgo: 45,
      isVerified: true,
    },
    {
      title: 'Ketua OSIS Terbaik',
      type: AchievementType.ORGANISASI,
      level: AchievementLevel.SEKOLAH,
      position: 'Peringkat 1',
      organizer: 'SMK Telkom Malang',
      studentIdx: 0,
      daysAgo: 60,
      isVerified: false,
    },
    {
      title: 'Juara 3 Lomba Karya Ilmiah',
      type: AchievementType.AKADEMIK,
      level: AchievementLevel.PROVINSI,
      position: 'Juara 3',
      organizer: 'LIPI Jawa Timur',
      studentIdx: 4,
      daysAgo: 20,
      isVerified: true,
    },
    {
      title: 'Peserta Jambore Nasional',
      type: AchievementType.NON_AKADEMIK,
      level: AchievementLevel.NASIONAL,
      position: 'Peserta',
      organizer: 'Kwartir Nasional Gerakan Pramuka',
      studentIdx: 1,
      daysAgo: 90,
      isVerified: true,
    },
    {
      title: 'Juara 1 Lomba PMR Tingkat Kabupaten',
      type: AchievementType.NON_AKADEMIK,
      level: AchievementLevel.KABUPATEN,
      position: 'Juara 1',
      organizer: 'PMI Kabupaten Malang',
      studentIdx: 2,
      daysAgo: 25,
      isVerified: false,
    },
  ];

  for (const a of achievementsData) {
    await prisma.achievement.create({
      data: {
        title: a.title,
        type: a.type,
        level: a.level,
        position: a.position,
        organizer: a.organizer,
        date: daysAgo(a.daysAgo),
        isVerified: a.isVerified,
        studentId: students[a.studentIdx].id,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  6. EXTRACURRICULARS
  // ══════════════════════════════════════════════════════════════════
  console.log('⚽  Creating extracurriculars …');

  const extracurricularsData = [
    { name: 'Futsal', description: 'Tim futsal sekolah', schedule: 'Senin & Rabu, 15:30-17:00', studentIdx: 0 },
    { name: 'Basket', description: 'Tim basket putra', schedule: 'Selasa & Kamis, 15:30-17:00', studentIdx: 1 },
    { name: 'Paduan Suara', description: 'Paduan suara sekolah', schedule: 'Jumat, 14:00-16:00', studentIdx: 2 },
    { name: 'Robotika', description: 'Klub robotika dan IoT', schedule: 'Sabtu, 08:00-11:00', studentIdx: 3 },
    { name: 'English Club', description: 'Klub bahasa Inggris', schedule: 'Rabu, 15:30-17:00', studentIdx: 4 },
    { name: 'Fotografi', description: 'Klub fotografi dan videografi', schedule: 'Sabtu, 09:00-11:00', studentIdx: 0 },
    { name: 'Tari Tradisional', description: 'Ekskul tari daerah', schedule: 'Kamis, 15:30-17:00', studentIdx: 2 },
  ];

  for (const e of extracurricularsData) {
    await prisma.extracurricular.create({
      data: {
        name: e.name,
        description: e.description,
        schedule: e.schedule,
        studentId: students[e.studentIdx].id,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  7. PAYMENT BILLS
  // ══════════════════════════════════════════════════════════════════
  console.log('💵  Creating bills …');

  const billsData = [
    { title: 'SPP Bulan Juni 2026', amount: 500000, dueDays: 30, description: 'Sumbangan Pembinaan Pendidikan bulan Juni', orgIdx: null },
    { title: 'SPP Bulan Juli 2026', amount: 500000, dueDays: 60, description: 'Sumbangan Pembinaan Pendidikan bulan Juli', orgIdx: null },
    { title: 'Iuran OSIS Semester Genap', amount: 150000, dueDays: 14, description: 'Iuran kegiatan OSIS semester genap', orgIdx: 0 },
    { title: 'Dana Pramuka Tahunan', amount: 200000, dueDays: 21, description: 'Dana kegiatan pramuka tahun ajaran baru', orgIdx: 1 },
    { title: 'Biaya Praktikum Lab IPA', amount: 350000, dueDays: 7, description: 'Biaya praktikum laboratorium IPA semester genap', orgIdx: null },
    { title: 'Iuran PMR', amount: 100000, dueDays: 14, description: 'Iuran anggota PMR semester genap', orgIdx: 2 },
  ];

  const bills: Awaited<ReturnType<typeof prisma.paymentBill.create>>[] = [];
  for (const b of billsData) {
    const bill = await prisma.paymentBill.create({
      data: {
        title: b.title,
        amount: b.amount,
        dueDate: daysFromNow(b.dueDays),
        description: b.description,
        orgId: b.orgIdx !== null ? orgs[b.orgIdx].id : null,
      },
    });
    bills.push(bill);
  }

  // ══════════════════════════════════════════════════════════════════
  //  8. PAYMENT SUBMISSIONS
  // ══════════════════════════════════════════════════════════════════
  console.log('📄  Creating payment submissions …');

  // Rina — SPP Juni verified
  await prisma.paymentSubmission.create({
    data: {
      billId: bills[0].id,
      studentId: students[0].id,
      status: PaymentStatus.VERIFIED,
      fileUrl: 'https://placehold.co/400x600/22c55e/white?text=Bukti+SPP+Juni',
      verifiedAt: daysAgo(2),
      verifiedBy: String(adminUser.id),
    },
  });

  // Rina — Iuran OSIS pending
  await prisma.paymentSubmission.create({
    data: {
      billId: bills[2].id,
      studentId: students[0].id,
      status: PaymentStatus.PENDING,
      fileUrl: 'https://placehold.co/400x600/eab308/white?text=Bukti+OSIS',
    },
  });

  // Dimas — SPP Juni pending
  await prisma.paymentSubmission.create({
    data: {
      billId: bills[0].id,
      studentId: students[1].id,
      status: PaymentStatus.PENDING,
      fileUrl: 'https://placehold.co/400x600/eab308/white?text=Bukti+SPP+Dimas',
    },
  });

  // Putri — SPP Juni rejected
  await prisma.paymentSubmission.create({
    data: {
      billId: bills[0].id,
      studentId: students[2].id,
      status: PaymentStatus.REJECTED,
      fileUrl: 'https://placehold.co/400x600/ef4444/white?text=Bukti+Ditolak',
      note: 'Bukti pembayaran tidak jelas, silakan upload ulang',
    },
  });

  // Fajar — Dana Pramuka verified
  await prisma.paymentSubmission.create({
    data: {
      billId: bills[3].id,
      studentId: students[3].id,
      status: PaymentStatus.VERIFIED,
      fileUrl: 'https://placehold.co/400x600/22c55e/white?text=Bukti+Pramuka',
      verifiedAt: daysAgo(5),
      verifiedBy: String(adminUser.id),
    },
  });

  // ══════════════════════════════════════════════════════════════════
  //  9. TREASURY TRANSACTIONS
  // ══════════════════════════════════════════════════════════════════
  console.log('🏦  Creating treasury transactions …');

  const treasuryData = [
    { type: TxType.IN, title: 'Anggaran OSIS dari Sekolah', amount: 5000000, daysAgo: 60, description: 'Dana operasional OSIS semester genap', orgIdx: 0 },
    { type: TxType.IN, title: 'Pembayaran SPP Juni - Rina Wijaya', amount: 500000, daysAgo: 2, description: 'Auto-recorded: pembayaran SPP terverifikasi', orgIdx: 0 },
    { type: TxType.OUT, title: 'Pembelian Alat Tulis OSIS', amount: 250000, daysAgo: 30, description: 'Pembelian ATK untuk kegiatan OSIS', orgIdx: 0 },
    { type: TxType.IN, title: 'Dana Pramuka dari Sekolah', amount: 3000000, daysAgo: 45, description: 'Dana operasional Pramuka', orgIdx: 1 },
    { type: TxType.OUT, title: 'Perlengkapan Kemah', amount: 800000, daysAgo: 10, description: 'Pembelian tenda dan perlengkapan kemah', orgIdx: 1 },
    { type: TxType.IN, title: 'Iuran Anggota PMR', amount: 1500000, daysAgo: 20, description: 'Total iuran anggota PMR semester ini', orgIdx: 2 },
    { type: TxType.OUT, title: 'Pembelian P3K PMR', amount: 350000, daysAgo: 7, description: 'Pembelian kotak P3K dan obat-obatan', orgIdx: 2 },
    { type: TxType.IN, title: 'Dana KIR dari Sekolah', amount: 2000000, daysAgo: 50, description: 'Dana riset KIR semester genap', orgIdx: 3 },
  ];

  for (const t of treasuryData) {
    await prisma.treasuryTransaction.create({
      data: {
        type: t.type,
        title: t.title,
        amount: t.amount,
        date: daysAgo(t.daysAgo),
        description: t.description,
        createdById: adminUser.id,
        orgId: orgs[t.orgIdx].id,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  10. PROGRESS SCORES (6 months per student)
  // ══════════════════════════════════════════════════════════════════
  console.log('📊  Creating progress scores …');

  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();

  for (const student of students) {
    for (let offset = 5; offset >= 0; offset--) {
      let month = currentMonth - offset;
      let year = currentYear;
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      await prisma.progressScore.create({
        data: {
          month,
          year,
          score: randomScore(),
          studentId: student.id,
        },
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  11. ACTIVITY LOGS
  // ══════════════════════════════════════════════════════════════════
  console.log('📝  Creating activity logs …');

  const activitiesData = [
    { title: 'Pembayaran SPP Juni Diverifikasi', type: 'Pembayaran', description: 'Pembayaran SPP bulan Juni sebesar Rp 500.000 telah diverifikasi.', daysAgo: 2, studentIdx: 0 },
    { title: 'Memenangkan Olimpiade Matematika', type: 'Prestasi', description: 'Meraih Juara 1 Olimpiade Matematika tingkat Provinsi.', daysAgo: 30, studentIdx: 0 },
    { title: 'Bergabung dengan KIR', type: 'Organisasi', description: 'Resmi bergabung sebagai anggota Kelompok Ilmiah Remaja.', daysAgo: 90, studentIdx: 0 },
    { title: 'Mengikuti Lomba Debat', type: 'Prestasi', description: 'Meraih Juara 2 Lomba Debat Bahasa Inggris tingkat Kabupaten.', daysAgo: 45, studentIdx: 1 },
    { title: 'Mengikuti Jambore Nasional', type: 'Prestasi', description: 'Berpartisipasi dalam Jambore Nasional Pramuka.', daysAgo: 90, studentIdx: 1 },
    { title: 'Terpilih sebagai Ketua PMR', type: 'Organisasi', description: 'Resmi dilantik sebagai Ketua PMR periode 2026.', daysAgo: 120, studentIdx: 2 },
    { title: 'Mengikuti Latihan Paskibra', type: 'Eskul', description: 'Mengikuti latihan rutin Paskibra untuk persiapan upacara.', daysAgo: 7, studentIdx: 3 },
    { title: 'Presentasi Karya Ilmiah', type: 'Prestasi', description: 'Mempresentasikan karya ilmiah di lomba tingkat Provinsi.', daysAgo: 20, studentIdx: 4 },
    { title: 'Pembayaran Dana Pramuka Diverifikasi', type: 'Pembayaran', description: 'Pembayaran dana Pramuka sebesar Rp 200.000 telah diverifikasi.', daysAgo: 5, studentIdx: 3 },
  ];

  for (const a of activitiesData) {
    await prisma.activityLog.create({
      data: {
        title: a.title,
        type: a.type,
        description: a.description,
        date: daysAgo(a.daysAgo),
        studentId: students[a.studentIdx].id,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  12. NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════
  console.log('🔔  Creating notifications …');

  const notificationsData = [
    // Admin notifications
    { text: 'Ada 2 pengajuan pembayaran baru yang menunggu verifikasi.', type: 'payment', userId: adminUser.id, isRead: false },
    { text: 'Prestasi baru perlu diverifikasi: Juara 1 Lomba PMR.', type: 'achievement', userId: adminUser.id, isRead: false },
    { text: 'Selamat datang di Askala SIAKAD!', type: 'info', userId: adminUser.id, isRead: true },
    // Student notifications (Rina)
    { text: 'Pembayaran SPP Juni kamu telah diverifikasi. Terima kasih!', type: 'payment', userId: studentUsers[0].id, isRead: true },
    { text: 'Tagihan baru: SPP Bulan Juli 2026 — Rp 500.000', type: 'payment', userId: studentUsers[0].id, isRead: false },
    { text: 'Prestasi "Juara 1 Olimpiade Matematika" kamu telah diverifikasi.', type: 'achievement', userId: studentUsers[0].id, isRead: true },
    // Parent notifications (Ahmad)
    { text: 'Rina Wijaya telah berhasil membayar SPP bulan Juni.', type: 'payment', userId: parentUser.id, isRead: true },
    { text: 'Nilai progress Rina bulan ini: 87.5', type: 'info', userId: parentUser.id, isRead: false },
    // Student notifications (Dimas)
    { text: 'Pengajuan pembayaran SPP Juni kamu sedang ditinjau.', type: 'payment', userId: studentUsers[1].id, isRead: false },
    // Student notifications (Putri)
    { text: 'Pengajuan pembayaran SPP Juni ditolak. Alasan: Bukti tidak jelas.', type: 'payment', userId: studentUsers[2].id, isRead: false },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({
      data: {
        text: n.text,
        type: n.type,
        userId: n.userId,
        isRead: n.isRead,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════
  //  SUMMARY
  // ══════════════════════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════════════');
  console.log('  ✅  SEEDING COMPLETE!');
  console.log('══════════════════════════════════════════════');
  console.log(`  Users:              ${2 + studentUsers.length + 1 + 1} (1 admin, 1 guru, 1 ortu, ${studentUsers.length} siswa)`);
  console.log(`  Organizations:      ${orgsData.length}`);
  console.log(`  Student-Org links:  ${studentOrgAssignments.length}`);
  console.log(`  Achievements:       ${achievementsData.length}`);
  console.log(`  Extracurriculars:   ${extracurricularsData.length}`);
  console.log(`  Bills:              ${billsData.length}`);
  console.log(`  Submissions:        5`);
  console.log(`  Treasury Tx:        ${treasuryData.length}`);
  console.log(`  Progress Scores:    ${students.length * 6}`);
  console.log(`  Activities:         ${activitiesData.length}`);
  console.log(`  Notifications:      ${notificationsData.length}`);
  console.log('──────────────────────────────────────────────');
  console.log('  📧 Akun Login Default (password: Password123)');
  console.log(`    Admin  : admin@askala.id`);
  console.log(`    Guru   : guru@askala.id`);
  console.log(`    Ortu   : ortu@askala.id`);
  console.log(`    Siswa  : rina@askala.id, dimas@askala.id, putri@askala.id, fajar@askala.id, nadia@askala.id`);
  console.log('══════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
