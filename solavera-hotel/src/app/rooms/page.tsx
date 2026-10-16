import type { Metadata } from "next";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { AssetImage } from "@/components/ui/asset-image";
import { RoomDiscovery } from "@/components/hotel/room-discovery";
import { rooms } from "@/data/rooms";

export const metadata: Metadata = { title: "Rooms & Suites | Solavéra Hotel", description: "Explore the Garden Deluxe Room, Ocean View Room, and Solavéra Ocean Suite." };

export default function RoomsPage() {
  return <><Header/><main><section className="interior-hero rooms-hero"><AssetImage src="/images/solavera-ocean-view-hd.png" alt="Ocean View Room opening to a tropical seascape" priority sizes="100vw" quality={90}/><div className="interior-hero-shade"/><div className="container interior-hero-content"><span className="eyebrow">THE ART OF STAYING</span><h1>Rooms <em>& Suites</em></h1><p>Private sanctuaries shaped by tropical light, natural textures, and the timeless beauty of the sea.</p></div></section><section className="rooms-discovery section-pad"><div className="container"><RoomDiscovery rooms={rooms}/></div></section></main><Footer/></>;
}
