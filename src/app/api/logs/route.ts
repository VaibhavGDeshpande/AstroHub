import { SeverityNumber, type Logger } from '@opentelemetry/api-logs'

declare global {
  // eslint-disable-next-line no-var
  var __posthogLogger: Logger | undefined
}

export async function GET() {
  globalThis.__posthogLogger?.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'API route called',
    attributes: { route: '/api' },
  })
  return Response.json({ ok: true })
}