import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="section">
      <div className="container-padded grid gap-6 lg:grid-cols-[0.35fr,0.65fr]">
        <AdminSidebar />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
