const mc = require('minecraft-protocol')
const fs = require('fs');

function addListeners (remoteClient, that) {

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
  


  if (remoteClient.isFirstConnection) {
    remoteClient.on('packet', (data, metadata) => {
      if (remoteClient.localClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {

        if(!metadata.name=='chat')
        {
          remoteClient.localClient.write(metadata.name, data);
        }
        else if(ignoredcheck(data.message,ignored))
        {
          remoteClient.localClient.write(metadata.name, data);
        }

      }
    })
  }

  remoteClient.localClient.on('packet', (data, metadata) => {
    if (metadata.name === 'kick_disconnect') return
    if (remoteClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {
      remoteClient.write(metadata.name, data)
    }
  })

  remoteClient.localClient.on('kick_disconnect', (data, metadata) => {
    if (that.getFallbackServerName() === remoteClient.currentServer) {
      remoteClient.write(metadata.name, data)
    } else {
      that.fallback(remoteClient.id)
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
        return false;
    }

    for(ele in obj.blacklist)
    {
      let split = message.split(' ')

      if(split[0]==obj.blacklist[ele])
        return false;
    } 
  }
  

  return true;
}

module.exports = addListeners
