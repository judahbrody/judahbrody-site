/**
 * Cloudflare Pages Function: contact form handler.
 *
 * Path:    /api/contact  (POST only)
 * Sends:   via env.SEND_EMAIL (Cloudflare Email Service binding)
 *
 * Env vars (set in Cloudflare Pages -> Settings -> Environment variables):
 *   TO_EMAIL       required, recipient (e.g. judahbrody@gmail.com)
 *   FROM_EMAIL     required, must be on the onboarded domain
 *                  (e.g. contact@judahbrody.com)
 *   FROM_NAME      optional, defaults to "Judah Brody Productions"
 *
 * Binding (set in Cloudflare Pages -> Settings -> Bindings):
 *   SEND_EMAIL     Email Service send binding
 *
 * See SETUP-CLOUDFLARE.md for one-time setup.
 */

const j = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function onRequestPost({ request, env }) {
  // 1) Parse (accept JSON or form-encoded, so the form still works if JS breaks)
  let payload = {};
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      payload = await request.json();
    } else if (ct.includes("form")) {
      const form = await request.formData();
      form.forEach((v, k) => (payload[k] = v));
    } else {
      return j({ ok: false, error: "unsupported content type" }, 415);
    }
  } catch {
    return j({ ok: false, error: "invalid body" }, 400);
  }

  // 2) Honeypot: if the hidden field is filled, silently accept and drop
  if ((payload.company_website || "").toString().trim() !== "") {
    return j({ ok: true });
  }

  // 3) Validate the fields the form actually collects
  const name = (payload.name || "").toString().trim();
  const email = (payload.email || "").toString().trim();
  const phone = (payload.phone || "").toString().trim();
  const service = (payload.service || "").toString().trim();
  const budget = (payload.budget || "").toString().trim();
  const message = (payload.message || "").toString().trim();

  if (!name || !email || !service || !message) {
    return j({ ok: false, error: "missing required fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return j({ ok: false, error: "invalid email" }, 400);
  }
  if (message.length > 5000 || name.length > 200) {
    return j({ ok: false, error: "too long" }, 413);
  }

  // 4) Config
  const TO_EMAIL = env.TO_EMAIL || "judahbrody@gmail.com";
  const FROM_EMAIL = env.FROM_EMAIL; // must be on onboarded domain
  const FROM_NAME = env.FROM_NAME || "Judah Brody Productions";

  if (!env.SEND_EMAIL || !FROM_EMAIL) {
    return j(
      { ok: false, error: "email service not configured" },
      503
    );
  }

  // 5) Build the message
  const subject = `New project inquiry: ${service}`;
  const text =
    `New inquiry from judahbrody.com\n\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Phone:   ${phone || "(none)"}\n` +
    `Service: ${service}\n` +
    `Budget:  ${budget || "(none)"}\n\n` +
    `Message:\n${message}\n`;

  const html =
    `<!doctype html><meta charset="utf-8">` +
    `<div style="font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#14110D">` +
    `<h2 style="margin:0 0 12px">New project inquiry</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse">` +
    `<tr><td><b>Name</b></td><td>${esc(name)}</td></tr>` +
    `<tr><td><b>Email</b></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>` +
    `<tr><td><b>Phone</b></td><td>${esc(phone) || "(none)"}</td></tr>` +
    `<tr><td><b>Service</b></td><td>${esc(service)}</td></tr>` +
    `<tr><td><b>Budget</b></td><td>${esc(budget) || "(none)"}</td></tr>` +
    `</table>` +
    `<h3 style="margin:20px 0 6px">Message</h3>` +
    `<div style="white-space:pre-wrap;border-left:3px solid #ccc;padding:0 12px">${esc(message)}</div>` +
    `<p style="color:#666;margin-top:22px;font-size:12px">Sent via judahbrody.com contact form.</p>` +
    `</div>`;

  // 6) Send
  try {
    await env.SEND_EMAIL.send({
      to: [{ email: TO_EMAIL }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: { email, name: name },
      subject,
      text,
      html,
    });
    return j({ ok: true });
  } catch (err) {
    return j(
      { ok: false, error: "send failed", detail: (err && err.message) || String(err) },
      502
    );
  }
}

// Any non-POST hitting /api/contact
export const onRequest = ({ request }) =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: { allow: "POST" },
  });
