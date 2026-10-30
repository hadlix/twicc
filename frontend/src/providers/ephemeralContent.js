
import { t as $t } from '../i18n/index.js'
/** Local prompt summaries never contain attachment bytes or preview URLs. */
export function ephemeralPromptText(text, attachments = []) {
    const summary = attachments.map(attachment =>
        $t("Attachment: {p0} ({p1})", { p0: (attachment.name || attachment.kind || 'file'), p1: (attachment.media_type || 'unknown type') }),
    ).join('\n')
    return [text, summary].filter(Boolean).join('\n\n')
}

/** Native assistant envelopes consumed by the existing message renderers. */
export function buildEphemeralResultContent(provider, text) {
    if (provider === 'codex') {
        return {
            type: 'event_msg',
            payload: {
                type: 'item_completed',
                item: { type: 'AgentMessage', id: 'twicc-ephemeral-result', content: [{ type: 'Text', text }] },
            },
        }
    }
    return { type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } }
}
