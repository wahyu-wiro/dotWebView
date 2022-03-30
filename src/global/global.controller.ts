import { Controller, CACHE_MANAGER, Inject, Request, Res } from '@nestjs/common';
import { GlobalService } from './global.service';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as NodeRSA from 'node-rsa';

const pub = fs.readFileSync('./publicKey.key', 'utf8');
const priv = fs.readFileSync('./privateKey.key', 'utf8');
@Controller('global')
export class GlobalController {    
    constructor(
        // private aes_key: aes_key,
        // private aes_iv: aes_iv,
        private readonly GlobalService: GlobalService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async getRedis(key) {
        return await this.cacheManager.get(key);
    }

    async addRedis(key, value) {
        await this.cacheManager.set(key, value, {ttl: 999999});
        return await this.cacheManager.get(key);
    }

    async delRedis(key) {
        return await this.cacheManager.del(key);
    }
    async getData(p) {
        try {            
            var key = 'key';
            if(p.deviceId) {key = key+'-'+p.deviceId}
            var g = await this.getRedis(key);
            var gr = JSON.parse(JSON.stringify(g))
            console.log('getRedis gr =>',gr)
            if(gr) { // if available
                var oKey  = gr;
                var objKey = JSON.parse(JSON.stringify(oKey));
                    var params = {
                    key: objKey,
                    header: p
                }
                console.log('params.key =>', params.key)
                var r = await this.GlobalService.getData(params);
                // console.log('rrrr =>', r)
                var res = JSON.parse(JSON.stringify(r));
                console.log('res =>',res )
                // if(res.data){
                //     var data =res.data
                //     data = JSON.parse(JSON.parse(JSON.stringify(data))); // double parse
                //     res.data = data;
                // }
                return res;
            }else{
                await this.logout(p);
                return {
                    responseCode: 401,
                    responseMessage: 'Redis not available'
                }
            }
        } catch (error) {
            console.log('getData error =>',error)
        }

    }
    async postData(p) {
        // console.log('postData global =>',p)
        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}

        var g = await this.getRedis(key);
        var gr = JSON.parse(JSON.stringify(g))
        console.log('postData gr =>',gr)
        if(gr) {
            var oKey  = gr;
            var objKey = JSON.parse(JSON.stringify(oKey));
            var params = {
                key: objKey,
                data: p
            }
            var r = await this.GlobalService.postData(params);
            var res = JSON.parse(JSON.stringify(r));
            return res;
        }else{
            console.log('401 postData')
            await this.logout(p);    
        }
    }
    async putData(p) {
        // console.log('putData p=>',p)
        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        var g = await this.getRedis(key);
        var gr = JSON.parse(JSON.stringify(g))
        console.log('putData gr =>',gr)
        if(gr) {
            var oKey  = gr;
            var objKey = JSON.parse(JSON.stringify(oKey));            
            var params = {
                key: objKey,
                data: p
            }
            console.log('putData param =>', JSON.stringify(p))
            var r = await this.GlobalService.putData(params);
            var res = JSON.parse(JSON.stringify(r));
            return res;
        }else{
            console.log('401 putData')
            await this.logout(p);
        }
    }    
    async delData(p) {
        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        var g = await this.getRedis(key);
        var gr = JSON.parse(JSON.stringify(g));
        console.log('delData gr =>',gr)
        if(gr) {
            var oKey  = gr;
            var objKey = JSON.parse(JSON.stringify(oKey));
            var params = {
                key: objKey,
                data: p
            }
            var r = await this.GlobalService.delData(params);
            var res = JSON.parse(JSON.stringify(r));
            return res;
        }else{
            console.log('401 putData')
            await this.logout(p);
        }

    }
    
    async logout(p) {
        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        var gr = await this.getRedis(key);
        console.log('getRedis =>',gr)
        if(gr){
            console.log('delRedis')
            await this.delRedis(key);
        }
    }
    
    async base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        // return new Buffer(bitmap).toString('base64');
        return Buffer.from(bitmap).toString('base64');
    }
    async encryptAes(text, key = process.env.AES_KEY_SERVER, iv = process.env.AES_IV_SERVER) {
        try {
            // console.log('key =>',key, 'iv =>',iv)
            let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(text, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (error) {
            console.log('error: ', error);
            return 500;
        }
    }

    async decryptAes(text, aesKey = process.env.AES_KEY_CLIENT, iv = process.env.AES_IV_CLIENT) {        
        try {
            let decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
            let decrypted = decipher.update(text, 'base64', 'utf8');
            return (decrypted + decipher.final('utf8'));
        } catch (error) {
            console.log('decryptAes: ', error);
            return false;
        }
    }

    async decrypterRsa(text) {
        try {
            // Decryption proccess  
            const priv = fs.readFileSync('./privateKey.key', 'utf8');
            
            const keyPriv = new NodeRSA(priv);
            let decrypted = keyPriv.decrypt(text, 'utf8')
            return decrypted;
        } catch (err) {
            console.log('decrypterRsa: ', err);
            return false;
        }
    }
    
    async encrypterRsa(text) {
        try {
            if (text == null) {
                text = "null";
            }
            var pub = fs.readFileSync('./publicServerKey.key', 'utf8');
            var keyPub = await new NodeRSA(pub);
            let encrypted = await keyPub.encrypt(text, 'base64');
            // console.log('encrypted =>',encrypted)
            return encrypted;
        } catch (err) {
            console.log('encrypter: ', err);
            return process.env.ERRORINTERNAL_RESPONSE;
        }
    }
    async encryptObjectAes(object,  except = [], json = []) {
        let result = {};
        let keys;
        var aeskey = process.env.AES_KEY_SERVER;
        var iv = process.env.AES_IV_SERVER;
        try {
            keys = Object.keys(object.toJSON())
        } catch (error) {
            keys = Object.keys(object);
        }
        // console.log('key: ', keys);
        for (let key of keys) {
            if (except.includes(key)) {
                result[key] = object[key]
            } else if (json.includes(key)) {
                result[key] = await this.encryptAes(JSON.stringify(object[key]) + '', aeskey, iv)
            } else {
                result[key] = await this.encryptAes(object[key] + '', aeskey, iv)
            }
        }
        return result;
    }
    async encryptObjectRsa(object, except = [], json = []) {
        let result = {};
        let keys;
        try {
            keys = Object.keys(object.toJSON())
        } catch (error) {
            keys = Object.keys(object);
        }
        // console.log('key: ', keys);
        for (let key of keys) {
            result[key] = object[key];
            if (json.includes(key)) {
                result[key] = JSON.stringify(result[key])
            }
            if (!except.includes(key)) {
                result[key] = await this.encrypterRsa(result[key])
            }
        }
        return result;
    }
}
