import { createRequest, createResponse } from 'node-mocks-http'
import CreateTemplateHandler from '../../pages/api/create-template'
import GetTemplateHandler from '../../pages/api/get-template'
import { create_template, truncate_template } from '../../lib/db'

describe('Post api/create-template', () => {
    beforeAll(async () => {
        await create_template()
    })
    afterAll(async () => {
        await truncate_template()
    })
    test('should create and get new template', async () => {
        const request = createRequest({
            method: 'POST',
            body: {
                name: 'test',
                creator: 'user:1',
                html: 'test_html'
            }
        })
        const response = createResponse()

        await CreateTemplateHandler(request, response)
        const id = response._getJSONData()['id']
        expect(response._getStatusCode()).toBe(200)

        const request2 = createRequest({
            method: 'GET',
            query: {
                id: id
            }
        })
        const response2 = createResponse()

        await GetTemplateHandler(request2, response2)
        expect(response2._getStatusCode()).toBe(200)
        expect(response2._getJSONData()['id']).toBe(id)
    })
})