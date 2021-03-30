const fs = require('fs');

function handleCommands (client, proxy, localServerOptions, proxyOptions) {

  let rawdata;
  let ignored;

  try 
  {
    rawdata = fs.readFileSync('./ignored.json');
    ignored = JSON.parse(rawdata);
  } catch (error) 
  {
    rawdata = undefined;
    ignored = undefined;
  }

  client.on('chat', (data, metadata) => {
    let split = data.message.split(' ')
    if (split[0] === '/server') 
    {
      if (proxy.serverList[split[1]]) {
        proxy.setRemoteServer(client.id, split[1])
      } else {
        let msg = {
          color: 'red',
          translate: 'chat.type.text',
          with:[{"text":"Syntax Error"}]
        }
        client.write('chat', { message: JSON.stringify(msg), position: 0, sender: 0 })
      }
    }
    else if (split[0] === '/plist')
    {
      let msg = "Player connessi al Proxy: " + proxy.playerCount;
      client.write('chat', { message: JSON.stringify(msg), position: 0, sender: 0 })
    }

    if(ignoredcheck(data.message,ignored)!=undefined)
    {
      dispatchMessage(proxy.clients,client, ignoredcheck(data.message,ignored));
    } 

  })
}

function ignoredcheck(message, obj)
{
  if(message!=undefined && obj!=undefined)
  {
    for (ele in obj.prefix)
    {
      if(message.substring(0,obj.prefix[ele].length)==obj.prefix[ele])
      {
        return message.substring(obj.prefix[ele].length,message.length);
      }
        
    }
  }
  return undefined;
}

function dispatchMessage(clients, sender, message)
{
  let out = {
    color: 'green',
    translate: 'chat.type.text',
    with:[{"text":"PROXY - "+sender.username},{"text":message}]
  }

  let print = JSON.stringify(out);

  for(ele in clients)
  {
    clients[ele].write('chat', { message: print, position: 0, sender: sender.uuid });
  }
}

module.exports = handleCommands
