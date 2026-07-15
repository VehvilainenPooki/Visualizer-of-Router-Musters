import { User, type NewUserAttrs } from './user.js'
import { Illustration } from './illustration.js'

User.hasMany(Illustration, { foreignKey: 'userId' })
Illustration.belongsTo(User, { foreignKey: 'userId' })

export { User, type NewUserAttrs, Illustration }
