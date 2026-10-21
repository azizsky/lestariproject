// 1. Tambahkan "enterprise" ke dalam tipe
export type PackageType = "basic" | "premium" | "exclusive" | "enterprise";

export interface PackageRules {
  maxGalleryPhotos: number;
  hasLoveStory: boolean;
  hasVideo: boolean;
  hasRundown: boolean;
  hasRSVP: boolean;
  hasGuestbook: boolean;
  hasWeddingGift: boolean;
  hasMusic: boolean;
}

export function getPackageRules(packageType: string = "basic"): PackageRules {
  const normalized = packageType?.toLowerCase();

  switch (normalized) {
    case "enterprise":
    case "exclusive":
      return {
        maxGalleryPhotos: 20, // Unlimited / Full
        hasLoveStory: true,
        hasVideo: true,
        hasRundown: true,
        hasRSVP: true,
        hasGuestbook: true,
        hasWeddingGift: true,
        hasMusic: true,
      };

    case "premium":
      return {
        maxGalleryPhotos: 10, // Maksimal 10 foto
        hasLoveStory: false,
        hasVideo: false,
        hasRundown: false,
        hasRSVP: true, // + RSVP
        hasGuestbook: false,
        hasWeddingGift: true, // + Wedding Gift
        hasMusic: true,
      };

    case "basic":
    default:
      return {
        maxGalleryPhotos: 0, // Tanpa foto galeri
        hasLoveStory: false,
        hasVideo: false,
        hasRundown: false,
        hasRSVP: false,
        hasGuestbook: false,
        hasWeddingGift: false,
        hasMusic: false,
      };
  }
}