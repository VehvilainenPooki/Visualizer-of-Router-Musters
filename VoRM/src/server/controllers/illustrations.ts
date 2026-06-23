import { Router } from 'express'
import { Illustration, Node, Link, NodeType, LinkType } from '../models/index.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticateToken, async (req, res) => {
  const illustrations = await Illustration.findAll({
    where: { userId: req.user!.id }
  })
  res.json(illustrations)
})

router.post('/', authenticateToken, async (req, res) => {
  const illustration = await Illustration.create({
    userId: req.user!.id
  })
  res.status(201).json(illustration)
})

router.delete('/:id', authenticateToken, async (req, res) => {
  const illustration = await Illustration.findByPk(Number(req.params.id))
  if (!illustration) {
    res.status(404).json({ error: 'illustration not found' })
    return
  }
  if (illustration.userId !== req.user!.id) {
    res.status(403).json({ error: 'not authorized' })
    return
  }
  await illustration.destroy()
  res.status(204).end()
})

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
