import {User} from '../models/User.js'
export class Database {
  users: User[] = []

  async getUsers() {
    return this.users
  }

  async getUserById(id: string) {
    return this.users.find((user) => user.id === id)
  }

  async addUser(user: User) {
    this.users = [...this.users, user]
  }

  async updateUser(updatedUser: User) {
    this.users = this.users.map((user) => {
      if (user.id === updatedUser.id) {
        return updatedUser
      } else {
        return user
      }
    })
  }

  async deleteUser(deletedUser: User) {
    this.users = this.users.filter((user) => user.id !== deletedUser.id)
  }
}