/**
 * FFLIntel Company mint. Same spine as coriolisagency /contact:
 * Form → Lead → Company on Coriolis OS. Not a newsletter list.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTENTS = new Set(["make", "sell"]);
const OS_TIMEOUT_MS = 8000;

type Body = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  intent?: unknown;
  company_url?: unknown;
};

function text(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function json(status: number, payload: { ok: boolean; error?: string }) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  if (text(body.company_url, 200)) {
    return json(200, { ok: true });
  }

  const name = text(body.name, 200);
  const company = text(body.company, 200);
  const email = text(body.email, 200);
  const intent = text(body.intent, 20);

  if (!name || !company || !email || !intent) {
    return json(400, { ok: false, error: "Name, company, email, and a door are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: "That email does not look valid." });
  }
  if (!INTENTS.has(intent)) {
    return json(400, { ok: false, error: "Pick I make the guns or I sell them." });
  }

  const osUrl = process.env.CORIOLIS_OS_URL?.trim().replace(/\/$/, "");
  const secret = process.env.FORM_INTAKE_SECRET?.trim();
  if (!osUrl || !secret) {
    console.error("fflintel lead: CORIOLIS_OS_URL / FORM_INTAKE_SECRET not set");
    return json(503, { ok: false, error: "Intake is not configured yet." });
  }

  const notes = [`door=fflintel`, `intent=${intent}`].join(" · ");

  try {
    const res = await fetch(`${osUrl}/api/forms/lead`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        companyName: company,
        intent,
        notes,
      }),
      signal: AbortSignal.timeout(OS_TIMEOUT_MS),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("fflintel lead: OS rejected", res.status, detail.slice(0, 240));
      return json(502, { ok: false, error: "Could not mint. Try again." });
    }
  } catch (err) {
    console.error("fflintel lead: OS failed", err);
    return json(502, { ok: false, error: "Could not reach Coriolis. Try again." });
  }

  return json(200, { ok: true });
}
