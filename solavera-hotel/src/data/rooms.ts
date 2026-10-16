import type { Room } from "@/types/room";

// Editorial room data. `available` is a demo flag, not live inventory.
export const rooms: Room[] = [
  {
    id: "garden-deluxe", slug: "garden-deluxe-room", name: "Garden Deluxe Room", category: "Garden collection",
    eyebrow: "A private tropical retreat",
    shortDescription: "A serene hideaway wrapped in lush garden views and natural textures.",
    description: "Open the doors to a quieter pace. The Garden Deluxe Room pairs warm natural finishes with an inviting private terrace overlooking the tropical landscape. It is a restful space for unhurried mornings and peaceful evenings.",
    image: "/images/solavera-garden-deluxe-hd.png", alt: "Garden Deluxe Room opening onto tropical greenery",
    gallery: [
      { src: "/images/solavera-garden-deluxe-hd.png", alt: "Garden Deluxe bedroom and terrace" },
      { src: "/images/solavera-ocean-view-hd.png", alt: "Warm coastal interiors at Solavéra" },
      { src: "/images/solavera-ocean-suite-hd.png", alt: "Resort interior overlooking the sea" },
    ],
    price: 9800, currency: "PHP", maxGuests: 2, adults: 2, children: 0, bedType: "King bed", roomSize: 42, view: "Tropical garden",
    amenities: ["High-Speed Wi-Fi", "Air Conditioning", "Smart TV", "Premium Bedding", "Rain Shower", "Luxury Toiletries", "Coffee & Tea", "In-Room Safe", "Private Terrace", "Daily Housekeeping", "Room Service"],
    features: ["Private terrace", "Rain shower", "Garden view"], featured: true, available: true,
  },
  {
    id: "ocean-view", slug: "ocean-view-room", name: "Ocean View Room", category: "Ocean collection",
    eyebrow: "Wake up to the horizon",
    shortDescription: "Sea views, soft coastal details, and space to slow down.",
    description: "Watch the light shift across the water from your own balcony. The Ocean View Room balances an airy, understated interior with a panorama that makes every sunrise and sunset feel a little more personal.",
    image: "/images/solavera-ocean-view-hd.png", alt: "Ocean View Room with balcony facing turquoise water",
    gallery: [
      { src: "/images/solavera-ocean-view-hd.png", alt: "Ocean View Room bedroom and balcony" },
      { src: "/images/solavera-ocean-suite-hd.png", alt: "Ocean-facing interiors and soaking bath" },
      { src: "/images/solavera-garden-deluxe-hd.png", alt: "Natural finishes in a Solavéra room" },
    ],
    price: 12800, currency: "PHP", maxGuests: 2, adults: 2, children: 0, bedType: "King or twin beds", roomSize: 48, view: "Panoramic ocean",
    amenities: ["High-Speed Wi-Fi", "Air Conditioning", "Smart TV", "Premium Bedding", "Rain Shower", "Luxury Toiletries", "Coffee & Tea", "Mini Bar", "In-Room Safe", "Private Balcony", "Daily Housekeeping", "Room Service"],
    features: ["Ocean balcony", "Soaking tub", "Sunset view"], featured: true, available: true,
  },
  {
    id: "ocean-suite", slug: "solavera-ocean-suite", name: "Solavéra Ocean Suite", category: "Signature suite",
    eyebrow: "The art of staying longer",
    shortDescription: "Generous living space and sweeping ocean panoramas.",
    description: "The Solavéra Ocean Suite is made for lingering. A generous lounge, a private ocean terrace, and a beautifully appointed bedroom create room for both togetherness and solitude, always with the sea close by.",
    image: "/images/solavera-ocean-suite-hd.png", alt: "Solavéra Ocean Suite with a sweeping sea view",
    gallery: [
      { src: "/images/solavera-ocean-suite-hd.png", alt: "Solavéra Ocean Suite bedroom and living area" },
      { src: "/images/solavera-ocean-view-hd.png", alt: "Ocean-facing balcony at Solavéra" },
      { src: "/images/solavera-garden-deluxe-hd.png", alt: "Tropical resort interiors" },
    ],
    price: 19800, currency: "PHP", maxGuests: 4, adults: 3, children: 2, bedType: "King bed + sofa bed", roomSize: 78, view: "Expansive ocean",
    amenities: ["High-Speed Wi-Fi", "Air Conditioning", "Smart TV", "Premium Bedding", "Rain Shower", "Luxury Toiletries", "Coffee & Tea", "Mini Bar", "In-Room Safe", "Private Ocean Terrace", "Separate Lounge", "Daily Housekeeping", "Room Service"],
    features: ["Private lounge", "Ocean terrace", "Soaking tub"], featured: true, available: true,
  },
];

export const getRoom = (slug: string) => rooms.find((room) => room.slug === slug);

export const peso = (amount: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);
