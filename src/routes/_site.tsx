import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { BagProvider } from "@/lib/cart";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { WhatsAppFloat } from "@/components/site/bits";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <BagProvider>
      <div className="flex min-h-screen flex-col bg-ivory">
        <Header />
        <main key={pathname} className="page-in flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <WhatsAppFloat />
    </BagProvider>
  );
}
