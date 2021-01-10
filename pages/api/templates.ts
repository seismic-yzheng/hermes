import { NextApiHandler } from 'next'
import { query, buildStatementForQuery, getOrderBy, getSortBy, getLimit, getOffset } from '../../lib/db'
import { templateTableName } from '../../lib/constants'

const templatesHandler: NextApiHandler = async (req, res) => {
    if (req.method != 'GET') {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        return
    }
    try {
        const order_by = await getOrderBy(req, ['created_at'])
        const sort_by = await getSortBy(req)
        const limit = await getLimit(req)
        const offset = await getOffset(req)
        let { statement, values } = await buildStatementForQuery(
            req.query, templateTableName, ['id', 'name', 'creator'], order_by, sort_by, limit, offset
        )
        const results = await query(statement, values)
        return res.json(results)
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ message: e.message })
    }
}

export default templatesHandler