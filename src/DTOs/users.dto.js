export default class UsersDto {
    constructor(user){
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.lastConnection = user.last_connection;
        this.password = 'Acceso Restringido'
        console.log("user.first_name:", user.first_name);
        console.log("user.last_name:", user.last_name);
    }
}