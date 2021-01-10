import { createRequest, createResponse } from 'node-mocks-http'
import templatesHandler from '../../pages/api/templates'
import templateHandler from '../../pages/api/template/[id]'
import createTemplateHandler from '../../pages/api/template'
import { createTemplateTable, truncateTemplateTable } from '../../lib/db'
import { getRandomInt, sleep } from '../../lib/helper'

jest.setTimeout(30000);

const createTemplate = async (user: string = 'user:test') => {
    const id = await getRandomInt(1000)
    const name = 'test' + id
    const html = 'test_html' + id
    const request = createRequest({
        method: 'POST',
        body: {
            name: name,
            creator: user,
            html: html
        }
    })
    const response = createResponse()
    await createTemplateHandler(request, response)
    return { response, name, user, html }
}

const getTemplate = async (id) => {
    const request = createRequest({
        method: 'GET',
        query: {
            id: id
        }
    })
    const response = createResponse()
    await templateHandler(request, response)
    return response
}

const getTemplates = async (query: {}) => {
    const request = createRequest({
        method: 'GET',
        query: query
    })
    const response = createResponse()
    await templatesHandler(request, response)
    return response
}

const deleteTemplate = async (id) => {
    const request = createRequest({
        method: 'DELETE',
        query: {
            id: id
        }
    })
    const response = createResponse()
    await templateHandler(request, response)
    return response
}

const getIDs = async (data: []) => {
    let received = [] as number[]
    data.forEach(item => {
        received.push(item['id'])
    })
    return received
}

describe('CRUD test for template', () => {
    beforeAll(async () => {
        await createTemplateTable()
    })
    afterAll(async () => {
        await truncateTemplateTable()
    })
    test('create template', async () => {
        const { response } = await createTemplate()
        expect(response._getStatusCode()).toBe(200)
    })
    test('get template', async () => {
        let { response } = await createTemplate()
        expect(response._getStatusCode()).toBe(200)
        const id = response._getJSONData()['id']
        response = await getTemplate(id)
        expect(response._getStatusCode()).toBe(200)
        expect(response._getJSONData()['id']).toBe(id)
    })
    test('delete template', async () => {
        let { response } = await createTemplate()
        expect(response._getStatusCode()).toBe(200)
        const id = response._getJSONData()['id']
        response = await deleteTemplate(id)
        expect(response._getStatusCode()).toBe(200)
        response = await getTemplate(id)
        expect(response._getStatusCode()).toBe(404)
    })
    test('update template', async () => {
        let { response } = await createTemplate()
        expect(response._getStatusCode()).toBe(200)
        const id = response._getJSONData()['id']
        let request = createRequest({
            method: 'PUT',
            query: {
                id: id
            },
            body: {
                name: 'test2',
                creator: 'user:2',
                html: 'test_html2'
            }
        })
        response = createResponse()
        await templateHandler(request, response)
        expect(response._getStatusCode()).toBe(200)
    })
    test('query templates', async () => {
        let ids = [] as string[]
        let names = [] as string[]
        const user = 'user:' + await getRandomInt(1000)
        for (let i = 0; i < 10; i++) {
            let { response, name } = await createTemplate(user)
            expect(response._getStatusCode()).toBe(200)
            ids.push(response._getJSONData()['id'])
            names.push(name)
            await sleep(1000)
        }
        let data: []
        let received = [] as number[]
        // query ids
        let response = await getTemplates({ id: ids.slice(0, 5) })
        expect(response._getStatusCode()).toBe(200)
        expect(await getIDs(response._getJSONData())).toEqual(ids.slice(0, 5))
        // query names
        response = await getTemplates({ name: names.slice(0, 5) })
        expect(response._getStatusCode()).toBe(200)
        expect(await getIDs(response._getJSONData())).toEqual(ids.slice(0, 5))
        // query creator
        response = await getTemplates({ creator: user })
        expect(response._getStatusCode()).toBe(200)
        expect(response._getJSONData().length).toBe(10)
        // test pagination
        response = await getTemplates({ creator: user, limit: 5, offset: 0 })
        expect(response._getStatusCode()).toBe(200)
        expect(await getIDs(response._getJSONData())).toEqual(ids.slice(0, 5))
        response = await getTemplates({ creator: user, limit: 5, offset: 5 })
        expect(response._getStatusCode()).toBe(200)
        expect(await getIDs(response._getJSONData())).toEqual(ids.slice(5, 10))
        // test order
        response = await getTemplates({ creator: user, order_by: 'created_at' })
        expect(response._getStatusCode()).toBe(200)
        expect(await getIDs(response._getJSONData())).toEqual(ids)
        response = await getTemplates({ creator: user, order_by: 'created_at', sort_by: 'DESC' })
        expect(response._getStatusCode()).toBe(200)
        expect((await getIDs(response._getJSONData())).reverse()).toEqual(ids)
    })
})