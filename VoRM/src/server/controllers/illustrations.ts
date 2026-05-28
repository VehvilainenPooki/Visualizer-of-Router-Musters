import { Router } from 'express'
import { Illustration, Node, Link, NodeType, LinkType } from '../models/index.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.get('/:id', authenticateToken, async (req, res) => {
  const illustration = await Illustration.findByPk(Number(req.params.id), {
    include: [
      {
        model: Node,
        include: [{ model: NodeType, as: 'nodeType' }]
      },
      {
        model: Link,
        include: [
          { model: LinkType, as: 'linkType' },
          { model: Node, as: 'sourceNode' },
          { model: Node, as: 'targetNode' }
        ]
      }
    ]
  })

  if (!illustration) {
    res.status(404).json({ error: 'illustration not found' })
    return
  }

  res.json(illustration)
})

export default router
