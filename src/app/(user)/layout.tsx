import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { getSiteConfig } from '@/actions/settings';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget whatsappNumber={siteConfig.contact.whatsapp} />
    </div>
  );
}
