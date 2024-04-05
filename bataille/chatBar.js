import React from 'react';

const ChatBody = ({ messages,userName,lastMessageRef }) => {
  return (
    <>
      <div className="chat-container">
        <div className="message-container">
          <header className="chat Header">
            <p>Chat Section, please be cordial towards each other this is a card games</p>
          </header>
          {messages && messages.length > 0 ? (
            messages.map((message) =>
              message.name===userName ?(
                <div className="message-chats" key={message.id}>
                  <p className="sender-name">{message.name}</p>
                  <div className="message-sender">
                    <p>{message.text}</p>
                  </div>
                </div>
              ) : (
                <div className="message-chats" key={message.id}>
                  <p>{message.name}</p>
                  <div className="message-recipient">
                    <p>{message.text}</p>
                  </div>
                </div>
              )
            )
          ): (
            <div className="no-messages">No messages yet.</div>
          )}
          <div ref={lastMessageRef} />
        </div>
      </div>
    </>
  );
};

export default ChatBody;
