import * as repository from '../../../repositories/post/postRepository.js'
import UserDTO from "../../../dto/UserDTO.js"
import CustomError from "../../../errors/CustomError.js"
import { ACTIVE, INACTIVE } from "../../../enums/StatusEnum.js"
import { ADMIN_ROLE } from "../../../enums/UserRoleEnum.js"
import Post from "../../../entities/Post.js"
import buildPost from "../../../builders/db/buildPost.js"
import * as commonService from "../commonService.js"
import {CATEGORY, USER} from "../../../enums/EntityTypeEnum.js"
import { ASC, DESC } from "../../../enums/DBSortingEnum.js"
import * as favoritesRepository from '../../../repositories/favorites/favoritesRepository.js'

const isDateValid = date => {
    const regex = /^\d{4}-\d{2}-\d{2}$/

    return regex.test(date)
}

const validateParams = params => {
    let result = {}
    const page = Number(params?.page)
    result.page = page && page > 0 ? Number(params.page) : 1
    result.rating = params.rating && params.rating === ASC ? ASC : DESC
    result.from = params.from && isDateValid(params.from) ? params.from : null
    result.to = params.to && isDateValid(params.to) ? params.to : null
    result.title = params.title.length > 3 ? params.title : null

    if (params.date === ASC || params.date === DESC) {
        result.date = params.date
    }

    if (params.status === ACTIVE || params.status === INACTIVE) {
        result.status = params.status
    }

    return result
}

export const getAll = async (user, ids, params) => {
    const postsDBResult = await repository.findAll(user, ids, validateParams(params))
    const postCategoryDBResult = await repository.findPostsCategoriesRelations(postsDBResult.map(post => post.id))
    const [authors, categories] = await Promise.all([
        commonService.getEntities([...new Set(postsDBResult.map(post => post.user_id))], USER),
        commonService.getEntities([...new Set(postCategoryDBResult.map(pc => pc.category_id))], CATEGORY),
    ])

    return postsDBResult.map(p => buildPost(
        p,
        new UserDTO(authors[p.user_id]),
        postCategoryDBResult.filter(pc => pc.post_id === p.id).map(pc => categories[pc.category_id])
    ))
}

export const get = async (id, user) => {
    const dbResult = await repository.findById(id)

    commonService.checkIfExists(dbResult, 'Post was not found')

    if (dbResult.status === INACTIVE && (!user || (user.id !== dbResult.user_id && user.role !== ADMIN_ROLE))) {
        throw new CustomError('Forbidden. You have no permission for this operation', 403)
    }

    const postCategoryDBResult = await repository.findPostsCategoriesRelations([dbResult.id])
    const [author, categories] = await Promise.all([
        commonService.getAuthor(dbResult.user_id),
        commonService.getEntities([...new Set(postCategoryDBResult.map(row => row.category_id))], CATEGORY),
    ])

    return buildPost(
        dbResult,
        new UserDTO(author),
        Object.values(categories)
    )
}

export const getPostCategories = async id => {
    const pcDBResult = await repository.findPostsCategoriesRelations([id])

    return Object.values(await commonService.getEntities(pcDBResult.map(pc => pc.category_id), CATEGORY))
}

export const create = async (data, user) => {
    const post = Post.create(data.title, data.content)
    const postId = await repository.add(post, user.id)
    await repository.addCategories(postId, data.categories)

    return postId
}

export const update = async (targetId, data, user) => {
    const postDBResult = await repository.findById(targetId)
    const postCategoryDBResult = await repository.findPostsCategoriesRelations([postDBResult.id])
    const [author, categories] = await Promise.all([
        commonService.getAuthor(postDBResult.user_id),
        commonService.getEntities([...new Set(postCategoryDBResult.map(row => row.category_id))], CATEGORY),
    ])
    const post = buildPost(
        postDBResult,
        author,
        Object.values(categories)
    )

    commonService.checkUpdateDeletePermissions(user, post.author.id)

    if ((data.title || data.content) && post.author.id !== user.id) {
        throw new CustomError('Forbidden. Only author can edit title and content', 403)
    }

    post.title = data.title ? data.title : post.title
    post.content = data.content ? data.content : post.content

    if (data.isActive !== undefined) {
        post.status = data.isActive ? ACTIVE : INACTIVE
    }

    if (data.categoriesToDelete) {
        await repository.removeCategories(post.id, data.categoriesToDelete)
    }

    if (data.categoriesToAdd) {
        await repository.addCategories(post.id, data.categoriesToAdd)
    }

    await repository.save(post)
}

export const remove = async (id, user) => {
    const postDBResult = await repository.findById(id)
    commonService.checkUpdateDeletePermissions(user, postDBResult.user_id)

    await repository.remove(id)
}

export const makeFavorite = async (id, user) => {
    await favoritesRepository.add(user.id, id)
}

export const unfavorite = async (id, user) => {
    await favoritesRepository.remove(user.id, id)
}
