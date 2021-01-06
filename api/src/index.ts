import 'reflect-metadata'
import express from 'express'
import {createConnection} from 'typeorm'
import { __prod__ } from './constants';
import {join} from 'path';
import { User } from './entities/User';

const main = async() =>{
    await createConnection({
        type:'postgres',
        database: 'vstodo',
        username: 'vstodo',
        password: 'vstodo',
        entities: [join(__dirname, './entities/*.*')],
        logging: !__prod__,
        synchronize: !__prod__
    });

    const user = await User.create({name: 'bob'}).save();
    console.log({user});

    const app = express();
    app.get('/', (_, res) =>{
        res.send("Hello");
    })
    app.listen(3002,()=>{
        console.log('listening on localhost:3002');
    })
}

main();