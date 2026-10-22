
export interface XtraDataProps {
  templateId?: string;

  packageType?: "basic" | "premium" | "exclusive";

  // Data pengantin
  namaPria?: string;
  namaWanita?: string;
  ortuaPria?: string;
  ortuaWanita?: string;

  // Informasi acara
  tanggal?: string;
  tanggalAkad?: string;
  tanggalResepsi?: string;
  lokasiAkad?: string;
  lokasiResepsi?: string;
  alamatLengkap?: string;
  googleMapsUrl?: string;

  // Konten undangan
  quote?: string;
  turutMengundang?: string[];
  loveStory?: Array<{
    year: string;
    title: string;
    story: string;
  }>;

  // Foto dan video
  coverFoto?: string;
  fotoPria?: string;
  fotoWanita?: string;
  galeriFoto?: string[];
  videoUrl?: string;
  videoPrewedUrl?: string;

  // Musik
  musikUrl?: string;
  customMusicUrl?: string;
  musicOption?: string;

  // RSVP
  enableRsvp?: boolean;

  // Rekening dan pembayaran
  rekening?: Array<{
    bank: string;
    nomor: string;
    atasNama: string;
  }>;

  rekeningBank?: Array<{
    bank: string;
    nomor: string;
    atasNama: string;
  }>;

  qrisImageUrl?: string;
}

export interface InvitationData {
  id: string | number;

  // Data pengantin
  nama_pria?: string;
  nama_wanita?: string;
  groom_name?: string;
  bride_name?: string;

  // Data tambahan nama pengantin
  nama_panggilan_pria?: string;
  nama_lengkap_pria?: string;
  nama_panggilan_wanita?: string;
  nama_lengkap_wanita?: string;

  // Informasi acara
  tanggal_akad?: string;
  tanggal_resepsi?: string;
  event_date?: string;
  lokasi_maps?: string;
  lokasi_teks?: string;
  orang_tua_pria?: string;
  orang_tua_wanita?: string;

  // Paket undangan
  package_type?: "basic" | "premium" | "exclusive";

  // Media dan lokasi
  cover_image?: string;
  music_url?: string;
  maps_url?: string;
  address?: string;

  // Identitas undangan
  slug?: string;
  template_id?: string;

  // Data tambahan
  xtra_data?: string | XtraDataProps;
}

export interface WeddingProps {
  invitation: InvitationData;
  xtraData?: XtraDataProps | string;
}
