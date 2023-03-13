// styles
import './normal.css'
import './App.css';

// hooks
import { useEffect, useRef, useState } from 'react'
import { useFetchResponse } from './hooks/useFetchResponse';

// components
import ChatMessage from './components/ChatMessage'

// data
import { personas } from './data/personas'



function App() {

  // add state for input and chat log
  const [persona, setPersona] = useState(null)
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([])

  const { fetchIsPending, fetchError, newMessage, fetchResponse } = useFetchResponse()

  // auto scroll to bottom of chotlog when new message comes in
  const bottomOfChat = useRef(null);

  // resets chat and changes persona
  async function resetChat(personaChoice) {
    setPersona(personaChoice)
    setChatLog([])
    let data = await fetchResponse([{role: "user", content: "Hallo"}], personaChoice.systemMessage)
    console.log(data)
    setChatLog([data])
  }

  // sends post request to OPEN AI api
  async function handleSubmit(e) {
    if(e){
      e.preventDefault()
    }
    let chatLogTemp = [...chatLog, {role: "user", content: input}]
    setChatLog(chatLogTemp)
    setInput("")
    const data = await fetchResponse(chatLogTemp, persona.systemMessage)
    setChatLog([...chatLogTemp, data])
  }

  // scroll to bottom of chatwindow when new message comes in
  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({behavior: 'smooth'})
  }, [chatLog])


console.log(chatLog, "HERE")
  return (
    <div className="App">

      {/* /// PERSONA SIDEMENU /// */}
      <aside className="sidemenu">

        <div className="sidebar-header">
          <h3>Personas</h3>
        </div>

        {/* // should turn this into a map // */}
        <div className="sidemenu-content">
          <div className="side-menu-button" onClick={() => resetChat(personas.fahrradLaden)}>
            <span>+</span>
            <p>{personas.fahrradLaden.personaTitle}</p>
          </div>

          <div className="side-menu-button" onClick={() => resetChat(personas.cafeMadel)}>
            <span>+</span>
          <p>{personas.cafeMadel.personaTitle}</p>
          </div>
        </div>
      </aside>


      {/* /// MAIN CHATBOX /// */}
      <section className="chatbox">

        <div className="header-sticky">
          {persona ? <h3>{persona.personaTitle}</h3> : <h3>Practice German with AI</h3>}
        </div>

        <div className="chat-log">

          {/* /// openscreen message /// */}
          {!persona && (
            <div className="no-persona">
              <h2>To Start Chatting</h2>
              <h3>Pick a Persona on the Left</h3>
            </div>
          )}

          {chatLog.length > 0 && chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} persona={persona} />
          ))}

          {/* /// adds a 'thinking' line for the ai /// */}
          {fetchIsPending && <ChatMessage message={{ role: "assistant", content: "..."}} persona={persona} />}
          {fetchError && <ChatMessage message={{ role: "assistant", content: {fetchError}}} persona={persona} />}
          {/* /// div so we can scroll to the bottom of the chat /// */}
          <div ref={bottomOfChat} />
        </div>

        {/* /// user input /// */}
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="1" 
              disabled={!persona ? true : false}
            />
            <button 
              className="submit-btn"
              disabled={!persona ? true : false}
              >submit
            </button>
          </form>
        </div>
        
      </section>


      {/* /// VOCAB SIDEBAR /// */}
      <aside className="sidemenu vocab-list">

        <div className="sidebar-header">
          <h3>Vocab</h3>
        </div>

        <div className="sidemenu-content">
          {persona && persona.vocab.map((item, index) => (
            <div className="side-menu-button vocab" key={index}>
            <p>{item.english}</p>
            <p>-</p>
            <p>{item.german}</p>
            {item.artikel && <p className="artikel">({item.artikel})</p>}
          </div>
          ))}
        </div>

      </aside>
    </div>
  );
}

export default App;
