import { NextApiHandler } from 'next'
import Filter from 'bad-words'
import { query, buildStatementForInsert } from '../../lib/db'
import { templateTableName } from '../../lib/constants'

const filter = new Filter()

const createTemplateHandler = async (req, res) => {
    if (req.method != 'POST') {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        return
    }
    const { name, creator, html } = req.body
    try {
        if (!name || !creator || !html) {
            return res
                .status(400)
                .json({ message: '`name`, `creator` and `html` are required' })
        }
        let { statement, values } = await buildStatementForInsert(req.body, templateTableName, ['name', 'creator', 'html'])
        const results = await query(statement, values)
        return res.json({ "id": results["insertId"] })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ message: e.message })
    }
}

export default createTemplateHandler