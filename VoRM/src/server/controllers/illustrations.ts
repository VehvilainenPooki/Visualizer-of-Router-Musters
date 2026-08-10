import { Router } from 'express'
import { Illustration } from '../models/index.js'
import { authenticateToken, optionalAuth, requireVerified } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticateToken, requireVerified, async (req, res) => {
  const illustrations = await Illustration.findAll({
    where: { userId: req.user!.id }
  })
  res.json(illustrations)
})

router.post('/', authenticateToken, requireVerified, async (req, res) => {
  if (!req.user!.isAdmin) {
    const count = await Illustration.count({ where: { userId: req.user!.id } })
    if (count >= 5) {
      res.status(403).json({ error: 'illustration limit reached' })
      return
    }
  }
  const illustration = await Illustration.create({
    userId: req.user!.id
  })
  res.status(201).json(illustration)
})

router.delete('/:id', authenticateToken, requireVerified, async (req, res) => {
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

router.patch('/:id/toggle-visibility', authenticateToken, requireVerified, async (req, res) => {
  const illustration = await Illustration.findByPk(Number(req.params.id))

  if (!illustration) {
    res.status(404).json({ error: 'illustration not found' })
    return
  }

  if (illustration.userId !== req.user!.id) {
    res.status(403).json({ error: 'not authorized' })
    return
  }

  illustration.public = !illustration.public
  await illustration.save()
  res.json(illustration)
})

router.get('/public', async (_req, res) => {
  const illustrations = await Illustration.findAll({
    where: { public: true }
  })
  res.json(illustrations)
})

router.get('/:id', optionalAuth, async (req, res) => {
  const illustration = await Illustration.findByPk(Number(req.params.id))

  if (!illustration) {
    res.status(404).json({ error: 'illustration not found' })
    return
  }

  if (!illustration.public && illustration.userId !== req.user?.id) {
    res.status(403).json({ error: 'not authorized' })
    return
  }

  res.json(illustration)
})

export default router
