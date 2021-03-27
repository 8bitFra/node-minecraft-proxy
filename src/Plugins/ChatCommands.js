function handleCommands (client, proxy, localServerOptions, proxyOptions) {
  client.on('chat', (data, metadata) => {
    let split = data.message.split(' ')
    if (split[0] === '/server') {
      if (proxy.serverList[split[1]]) {
        proxy.setRemoteServer(client.id, split[1])
      } else {
        const msg = {
          color: 'red',
          translate: 'chat.type.text',
          with:[{"text":"Syntax Error"}]
        }
        client.write('chat', { message: JSON.stringify(msg), position: 0, sender: 0 })
      }
    }
  })
}

module.exports = handleCommands
