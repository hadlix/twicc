
import { t as $t } from '../i18n/index.js'
export function resolveSessionComposerLock({
    hasAnswerablePendingRequest,
    isComputePending,
}) {
    if (hasAnswerablePendingRequest) {
        return {
            locked: true,
            get reason() { return $t("Answer the pending request to send") },
            presentation: 'paused',
        }
    }
    if (isComputePending) {
        return {
            locked: true,
            get reason() { return $t("Wait for session preparation to finish before sending") },
            presentation: 'disabled',
        }
    }
    return { locked: false, reason: '', presentation: 'paused' }
}
