import express from 'express'


const main = async() =>{
    const app = express();
    app.get('/', (_, res) =>{
        res.send("Hello");
    })
    app.listen(3002,()=>{
        console.log('listening on localhost:3002');
    })
}

main();