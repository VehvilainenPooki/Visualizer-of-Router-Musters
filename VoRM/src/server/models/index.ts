import { User } from './user.js'
import { Illustration } from './illustration.js'
import { Node } from './node.js'
import { Link } from './link.js'
import { NodeType } from './nodeType.js'
import { LinkType } from './linkType.js'

User.hasMany(Illustration, { foreignKey: 'userId' })
Illustration.belongsTo(User, { foreignKey: 'userId' })

Illustration.hasMany(Node, { foreignKey: 'illustrationId' })
Node.belongsTo(Illustration, { foreignKey: 'illustrationId' })

Illustration.hasMany(Link, { foreignKey: 'illustrationId' })
Link.belongsTo(Illustration, { foreignKey: 'illustrationId' })

NodeType.hasMany(Node, { foreignKey: 'nodeTypeId' })
Node.belongsTo(NodeType, { foreignKey: 'nodeTypeId', as: 'nodeType' })

LinkType.hasMany(Link, { foreignKey: 'linkTypeId' })
Link.belongsTo(LinkType, { foreignKey: 'linkTypeId', as: 'linkType' })

Link.belongsTo(Node, { foreignKey: 'sourceNodeId', as: 'sourceNode' })
Link.belongsTo(Node, { foreignKey: 'targetNodeId', as: 'targetNode' })

export { User, Illustration, Node, Link, NodeType, LinkType }
