const CALL_CENTER_URL = 'https://call-center.rsouq.com/api/crm/leads';

export default async function(req) {
  try {
    let payload = {};
    try {
      payload = await req.json();
    } catch (e) {
      // empty / non-JSON body — fine for direct invocations passing nothing
    }

    // Entity automation sends { event, data }; direct invocation sends lead fields directly.
    const lead = payload.data || payload;

    if (!lead || !lead.phone) {
      return Response.json({ error: 'Missing lead data (phone required)' }, { status: 400 });
    }

    const body = {
      name: lead.full_name || lead.name || '',
      phone: lead.phone,
    };
    // Attach the extra qualification fields when present so the call center has full context.
    ['interest_type', 'has_experience', 'experience_details', 'management_preference', 'investment_goal', 'budget_range', 'notes'].forEach((k) => {
      if (lead[k] !== undefined && lead[k] !== null && lead[k] !== '') {
        body[k] = lead[k];
      }
    });

    const res = await fetch(CALL_CENTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return Response.json({ error: 'Call center rejected the lead', status: res.status, detail }, { status: 502 });
    }

    return Response.json({ ok: true, forwarded: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}