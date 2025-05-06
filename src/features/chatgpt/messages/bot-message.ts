export interface BotMessage {
    conversationId: string,
    userText: string,
    botText: string,
    botSpeech: Blob
}