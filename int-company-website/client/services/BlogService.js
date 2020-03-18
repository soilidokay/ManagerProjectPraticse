import {
  Containers,
  validateUpload,
  getPublicFileLink
} from '../../common/models/Container'
import ValidationError from './ValidationError'
import { StorageGatewayInterface } from './GatewayInterface'
import { Status } from '../../common/models/Blog'

export type Query = {
  title?: RegExp,
  content?: string,
  status?: string,
  name?: string,
  featuredImageUrl?: string,
  tags?: []
}

export interface BlogGatewayInterface {
  count(where: Query): Promise<number>;

  find({ where: Query, skip: number, order: string, limit: number }): Promise<
    [Object]
  >;

  create(blog: {
    title: string,
    content: string,
    status: string,
    featuredImageUrl: string,
    tags: []
  }): Promise<Object>;

  findById(id: string): Promise<Object>;

  findByName(name: string): Promise<Object>;

  updateById(id: string, data: Object): Promise<Object>;

  deleteById(id: string): Promise<Object>;
}

export interface BlogTagGatewayInterface {
  create(blogTag: { label: string }): Promise<Object>;
  updateById(id: string, blogTag: { label: string }): Promise<Object>;
  findAll(): Promise<Object>;
  findById(id: string): Promise<Object>;
  find({ where: Query, skip: number, order: string, limit: number }): Promise<
    [Object]
  >;
  count(where: Query): Promise<number>;
  deleteById(id: string): Promise<Object>;
}

export default class BlogService {
  constructor (options: {
    blogGateway: BlogGatewayInterface,
    storageGateway: StorageGatewayInterface,
    blogTagGateway: BlogTagGatewayInterface
  }) {
    const { blogGateway, storageGateway, blogTagGateway } = options
    this.blogGateway = blogGateway
    this.storageGateway = storageGateway
    this.blogTagGateway = blogTagGateway
  }

  async createBlog ({ title, content, status, featuredImageUrl, tags }) {
    return this.blogGateway.create({
      title,
      content,
      status,
      featuredImageUrl,
      tags
    })
  }

  async updateBlog (
    id,
    { title, content, status, name, featuredImageUrl, tags }
  ) {
    return this.blogGateway.updateById(id, {
      title,
      content,
      status,
      name,
      featuredImageUrl,
      tags
    })
  }

  async getBlogById (id) {
    return this.blogGateway.findById(id)
  }

  async uploadFeaturedImage (file) {
    const errors = validateUpload(file)

    if (errors.length) {
      throw new ValidationError(errors)
    }

    const uploadedFile = await this.storageGateway.upload(
      Containers.BLOG_IMAGE,
      file
    )
    return getPublicFileLink(uploadedFile)
  }

  async updateFeaturedImageUrl (featuredImageUrl) {
    await this.blogGateway.updateById(featuredImageUrl)
  }

  async getBlogsForPublic (page = 0) {
    const where = { status: Status.PUBLISHED }
    const limit = 10
    const total = await this.blogGateway.count(where)
    const blogs = await this.blogGateway.find({
      where,
      skip: page * limit,
      order: 'createdAt DESC',
      limit
    })
    const nPage = Math.ceil(total / limit)
    return { blogs, nPage }
  }

  async getBlogByName (name) {
    return this.blogGateway.findByName(name)
  }

  async getBlogsForAdmin ({ where, skip, order = 'createdAt desc', limit }) {
    const total = await this.blogGateway.count(where)
    const blogs = await this.blogGateway.find({
      where,
      skip,
      order,
      limit
    })
    return { total, blogs }
  }
  async deleteBlogWithId (id) {
    return this.blogGateway.deleteById(id)
  }

  async getBlogTags () {
    return this.blogTagGateway.findAll()
  }

  async createBlogTag (label) {
    return this.blogTagGateway.create({ label })
  }

  async updateBlogTag (id, label) {
    return this.blogTagGateway.updateById(id, { label })
  }

  async getBlogTagsForAdmin ({ where, skip, order = 'createdAt desc', limit }) {
    const total = await this.blogTagGateway.count(where)
    const blogTags = await this.blogTagGateway.find({
      where,
      skip,
      order,
      limit
    })
    return { total, blogTags }
  }
  async deleteBlogTagWithId (id) {
    return this.blogTagGateway.deleteById(id)
  }
  async getBlogTagById (id) {
    return this.blogTagGateway.findById(id)
  }
}
