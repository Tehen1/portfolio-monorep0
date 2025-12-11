import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/layout";
import SEOOverview from "@/components/dashboard/seo-overview";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect('/handler/sign-in');
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de Bord SEO
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Bienvenue, {user.displayName || user.primaryEmail}
            </span>
          </div>
        </div>
        
        <SEOOverview userId={user.id} />
      </div>
    </DashboardLayout>
  );
}
