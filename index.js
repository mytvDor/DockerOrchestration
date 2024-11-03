// const Docker =require('dockerode')
// const express  = require('express')

// const app =express()

// const docker = new Docker()

// app.use(express.json())

// const PORT_TO_CONTAINER={}
// const CONTAINER_TO_PORT={}

// app.get('/containers' ,async(req,res)=>{

//     const containers = await docker.listContainers();
//     return res.json({containers:containers.map(e=>({id:e.Id , names: e.Names,image:e.Image }))})
// })

// app.post('/containers', async (req,res)=>{
//     const {image} =req.body
//     await docker.pull(image)
// const availablePort=(()=>{

//     for(let i=8000 ; i<8999 ; i++){
// if(PORT_TO_CONTAINER[i]) continue;
// return `${i}`

//     }
// })()


// if(!availablePort) return res.json({error:'o available PORT'})

//     const  container =await docker.createContainer({
//         Image:image,
//         Cmd: ['sh'],
//         AttachStdout:true,
//         Tty:true,
//         HostConfig:{
//             PortBindings:{
//                 '80/tcp':[{HostPort: availablePort}]
//             }
//         }
//     })
// PORT_TO_CONTAINER[availablePort] = container.id
// CONTAINER_TO_PORT[container.id] =availablePort
//     await container.start()
//   res.json({container:container.id})
// })

// app.listen(9000,()=>console.log(`express running on PORT:9000`))

const Docker = require('dockerode');
const express = require('express');

const app = express();
const docker = new Docker();

app.use(express.json());

const PORT_TO_CONTAINER = {};
const CONTAINER_TO_PORT = {};

app.get('/containers', async (req, res) => {
    const containers = await docker.listContainers();
    return res.json({ 
        containers: containers.map(e => ({ id: e.Id, names: e.Names, image: e.Image })) 
    });
});

app.post('/containers', async (req, res) => {
    const { image } = req.body;

    // Attempt to pull the image, catch error if it doesn't exist
    try {
        await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
                if (err) return reject(err);
                docker.modem.followProgress(stream, onFinished, onProgress);

                function onFinished(err, output) {
                    if (err) return reject(err);
                    resolve(output);
                }
                
                function onProgress(event) {
                    // Progress handling (optional)
                }
            });
        });
    } catch (error) {
        return res.status(404).json({ error: 'Image not found or failed to download' });
    }

    const availablePort = (() => {
        for (let i = 8000; i < 8999; i++) {
            if (PORT_TO_CONTAINER[i]) continue;
            return `${i}`;
        }
    })();

    if (!availablePort) return res.json({ error: 'No available port' });

    const container = await docker.createContainer({
        Image: image,
        Cmd: ['sh'],
        AttachStdout: true,
        Tty: true,
        HostConfig: {
            PortBindings: {
                '80/tcp': [{ HostPort: availablePort }]
            }
        }
    });

    PORT_TO_CONTAINER[availablePort] = container.id;
    CONTAINER_TO_PORT[container.id] = availablePort;

    await container.start();
    res.json({ container: container.id });
});

app.listen(9000, () => console.log(`Express running on PORT: 9000`));
