export function speak(text: string) {
    if (typeof window === 'undefined') return
    if (!('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
}