export type Query = {
  id?: string,
  name?: RegExp,
  email?: RegExp,
  emailVerified?: boolean
}

export interface UserGatewayInterface {
  count(where: Query): Promise<number>;

  find({ where: Query, skip: number, order: string, limit: number }): Promise<
    [Object]
  >;

  create(user: {
    name: string,
    email: string,
    password: string
  }): Promise<Object>;

  findById(id: string): Promise<Object>;

  updateById(
    id: string,
    { name: string, email: string, emailVerified: boolean }
  ): Promise<Object>;

  deleteById(id: string): Promise<Object>;
}

export default class UserService {
  constructor (options: {
    userGateway: UserGatewayInterface,
    roleGateway: Object
  }) {
    const { userGateway, roleGateway } = options
    this.userGateway = userGateway
    this.roleGateway = roleGateway
  }

  async getUsersForAdmin ({ where, skip, order = 'createdAt desc', limit }) {
    const total = await this.userGateway.count(where)
    const users = await this.userGateway.find({
      where,
      skip,
      order,
      limit,
      include: 'roles'
    })
    return { total, users }
  }

  async getRolesForAdmin ({ where }) {
    return this.roleGateway.find({ where })
  }

  async createUser ({ name, email, password }) {
    return this.userGateway.create({ name, email, password })
  }

  async getUserFromId (id) {
    return this.userGateway.findById(id)
  }

  async updateUser ({ id, name, email, emailVerified }) {
    return this.userGateway.updateById(id, { name, email, emailVerified })
  }

  async deleteUserWithId (id) {
    return this.userGateway.deleteById(id)
  }

  async count (where) {
    return this.userGateway.count(where)
  }
}
