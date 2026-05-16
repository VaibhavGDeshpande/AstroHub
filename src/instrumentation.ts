import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!apiKey) {
      console.warn('[Instrumentation] POSTHOG_API_KEY is not set — logging disabled.')
      return
    }

    const exporter = new OTLPLogExporter({
      url: 'https://us.i.posthog.com/otlp/v1/logs',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': process.env.NEXT_PUBLIC_SITE_NAME ?? 'astrohub',
      }),
      processors: [new SimpleLogRecordProcessor(exporter)],
    })

    // Make the logger available globally for API routes
    ;(globalThis as Record<string, unknown>).__posthogLogger = loggerProvider.getLogger('astrohub')
  }
}
