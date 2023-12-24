import {promises as fs} from 'fs'
import {nanoid} from 'nanoid'
import UsersManager from './product.files.js'

const allProducts = new UsersManager

export default class UsersManager {
    constructor(){
        this.path = "./src/files/users.json"
    }

}