import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

/* Marketing chrome for the public site. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>{children}</main>
      <Footer />
      <SmoothScroll />
    </>
  );
}
