import WeddingRenderer from "@/components/WeddingRenderer";
import { getInvitationBySlug } from "@/lib/invitations"; // sesuaikan helper fetch kamu

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1>Undangan tidak ditemukan</h1>
      </div>
    );
  }

  // Parse xtra_data jika bentuknya string JSON
  const xtraData = typeof invitation.xtra_data === "string" 
    ? JSON.parse(invitation.xtra_data) 
    : (invitation.xtra_data || {});

  return <WeddingRenderer invitation={invitation} xtraData={xtraData} />;
}