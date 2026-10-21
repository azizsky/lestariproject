export async function getInvitationBySlug(slug: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) return null;

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: "SELECT * FROM invitations WHERE slug = ?",
          params: [slug],
        }),
        cache: "no-store",
      }
    );

    const json = await res.json();
    if (!json.success || !json.result[0]?.results?.length) return null;
    return json.result[0].results[0];
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return null;
  }
}