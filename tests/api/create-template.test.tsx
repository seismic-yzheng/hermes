import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/create-template';


describe('Post api/create-template', () => {
    test('should create a new template', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                name: 'test',
                creator: 'user:1',
                html: 'test_html'
            },
        })

        await handler(req, res)
        expect(res._getStatusCode()).toBe(200)
    })
})