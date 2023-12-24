export default class UsersDto {
    constructor(user){
        this.first_name = `${user.first_name} ${user.last_name}`
        this.password = 'Acceso Restringido'
    }
}