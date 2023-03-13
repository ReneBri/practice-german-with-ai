// styles
import './chatMessage.css'

export default function ChatMessage({ message, persona }) {
  return (
    <div className={message.role === "assistant" ? "chat-message chatgpt" : "chat-message"}>
        <div className="chat-message-center">
          <div className={message.role === "assistant" ? "avatar chatgpt" : "avatar"}>
            {message.role !== "assistant" ? <h3 className="avatar-text-user">You</h3> : <h3 className="avatar-text-assistant">{persona.avatar}</h3>}
          </div>
          <div className="message">
            {message.content}
          </div>
        </div>
      </div>
  )
}
