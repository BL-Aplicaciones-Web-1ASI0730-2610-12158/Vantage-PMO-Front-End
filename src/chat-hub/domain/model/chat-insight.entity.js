/** AI-generated insight for a chat channel. */
export class ChatInsight {
    constructor({ chatId, meetingTag, timeAgo, meetingTitle, insights, sentimentProductive, sentimentText }) {
        this.chatId              = chatId;
        this.meetingTag          = meetingTag ?? '';
        this.timeAgo             = timeAgo ?? '';
        this.meetingTitle        = meetingTitle ?? '';
        this.insights            = insights ?? [];
        this.sentimentProductive = sentimentProductive ?? 0;
        this.sentimentText       = sentimentText ?? '';
    }
}
