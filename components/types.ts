export interface XtraDataProps {
  packageType?: "basic" | "premium" | "exclusive";
  namaPria?: string;
  namaWanita?: string;
  ortuaPria?: string;
  ortuaWanita?: string;
  turutMengundang?: string[];
  tanggal?: string;
  tanggalAkad?: string;
  tanggalResepsi?: string;
  lokasiAkad?: string;
  lokasiResepsi?: string;
  quote?: string;
  coverFoto?: string;
  fotoPria?: string;
  fotoWanita?: string;
  galeriFoto?: string[];
  loveStory?: Array<{ year: string; title: string; story: string }>;
  videoUrl?: string;
  googleMapsUrl?: string;
  alamatLengkap?: string;
  rekening?: Array<{ bank: string; nomor: string; atasNama: string }>;
  musikUrl?: string;
}

export interface XtraDataProps {
  templateId?: string;

  packageType?: "basic" | "premium" | "exclusive";
  namaPria?: string;
  namaWanita?: string;
  ortuaPria?: string;
  ortuaWanita?: string;
  turutMengundang?: string[];
  tanggal?: string;
  tanggalAkad?: string;
  tanggalResepsi?: string;
  lokasiAkad?: string;
  lokasiResepsi?: string;
  quote?: string;
  coverFoto?: string;
  fotoPria?: string;
  fotoWanita?: string;
  galeriFoto?: string[];
  loveStory?: Array<{ year: string; title: string; story: string }>;
  videoUrl?: string;
  googleMapsUrl?: string;
  alamatLengkap?: string;
  rekening?: Array<{ bank: string; nomor: string; atasNama: string }>;
  musikUrl?: string;
}

export interface InvitationData {
  id: string | number;
  nama_pria?: string;
  nama_wanita?: string;
  groom_name?: string;
  bride_name?: string;
  tanggal_akad?: string;
  tanggal_resepsi?: string;
  event_date?: string;
  package_type?: "basic" | "premium" | "exclusive";
  cover_image?: string;
  music_url?: string;
  maps_url?: string;
  address?: string;
  xtra_data?: string | XtraDataProps;
}

export interface WeddingProps {
  invitation: InvitationData;
  xtraData?: XtraDataProps | string;
}
