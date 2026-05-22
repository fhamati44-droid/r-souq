import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { nameEn } = await req.json();
    if (!nameEn) return Response.json({ error: 'nameEn is required' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `ترجم اسم المنتج التالي إلى العربية بشكل مختصر واحترافي مناسب للتجارة الإلكترونية. أعطني فقط الاسم المترجم بدون أي شرح أو علامات ترقيم إضافية:\n${nameEn}`,
    });

    const arabicName = typeof result === 'string' ? result.trim() : (result?.result || result?.text || nameEn);

    return Response.json({ arabicName });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});